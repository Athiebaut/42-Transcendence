#!/bin/sh
set -e

: "${VAULT_ADDR:=http://vault:8200}"
: "${VAULT_SECRET_PATH:=secret/data/common}"

ROLE_ID_FILE="/vault/config/role_id.txt"
SECRET_ID_FILE="/vault/config/secret_id.txt"

echo "Waiting for Vault to be ready..."
until curl -s "$VAULT_ADDR/v1/sys/health" | grep '"sealed":false'; do
    echo "Waiting for Vault initialization and unseal..."
    sleep 5
done

# --- 1. AUTHENTIFICATION ---
echo "Waiting for AppRole IDs..."
until [ -f "$ROLE_ID_FILE" ] && [ -f "$SECRET_ID_FILE" ]; do
    sleep 1
done
sleep 1

ROLE_ID=$(cat "$ROLE_ID_FILE")
SECRET_ID=$(cat "$SECRET_ID_FILE")

echo "Authenticating via AppRole..."
LOGIN_PAYLOAD="{\"role_id\": \"$ROLE_ID\", \"secret_id\": \"$SECRET_ID\"}"
VAULT_LOGIN_RESPONSE=$(curl -s --request POST --data "$LOGIN_PAYLOAD" "$VAULT_ADDR/v1/auth/approle/login")
export VAULT_TOKEN=$(echo "$VAULT_LOGIN_RESPONSE" | jq -r '.auth.client_token')

if [ -z "$VAULT_TOKEN" ] || [ "$VAULT_TOKEN" = "null" ]; then
    echo "ERROR: Vault authentication failed."
    exit 1
fi

# --- 2. INJECTION DES SECRETS ---
echo "Fetching secrets from path: $VAULT_SECRET_PATH"

SECRETS_RESPONSE=$(curl -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$VAULT_SECRET_PATH")

echo "DEBUG VAULT RESPONSE: $SECRETS_RESPONSE"

if echo "$SECRETS_RESPONSE" | grep -q "errors"; then
    echo "WARNING: Could not fetch secrets from $VAULT_SECRET_PATH"
else
    # A. Injection en mémoire (pour le processus Node.js actuel)
    echo "$SECRETS_RESPONSE" | jq -r '.data.data | to_entries | .[] | "export \(.key)=\"\(.value)\""' > /tmp/env_vars.sh
    . /tmp/env_vars.sh
    rm /tmp/env_vars.sh

    # B. Création du fichier physique
    if [ -n "$OUTPUT_ENV_FILE" ]; then
        echo "Creating .env file at $OUTPUT_ENV_FILE"
        echo "$SECRETS_RESPONSE" | jq -r '.data.data | to_entries | .[] | "\(.key)=\"\(.value)\""' > "$OUTPUT_ENV_FILE"

        chmod 600 "$OUTPUT_ENV_FILE"
    fi

    echo "Secrets injected into environment variables successfully."
fi

# --- 3. LANCEMENT DU SERVICE ---
echo "Starting service command: $@"
exec "$@"
