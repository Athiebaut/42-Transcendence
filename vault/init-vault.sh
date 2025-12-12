#!/bin/sh
set -e

# Configuration des adresses locales pour la CLI interne
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_API_ADDR='http://127.0.0.1:8200'

INIT_FILE="/vault/data/init.json"
TOKEN_FILE="/vault/config_output/root_token.txt"
ROLE_ID_FILE="/vault/config_output/role_id.txt"
SECRET_ID_FILE="/vault/config_output/secret_id.txt"

# Installation des dépendances
apk update && apk add curl jq >/dev/null

echo "[Init] Waiting for Vault HTTP listener..."
until curl -s "$VAULT_ADDR/v1/sys/health" > /dev/null; do
    sleep 1
done
echo "[Init] Vault is listening."

# ----------------------------------------------------------------------
# 1. INITIALISATION ET DESCELLEMENT (Idempotent)
# ----------------------------------------------------------------------

if [ -f "$INIT_FILE" ]; then
    echo "[Init] Vault already initialized. Loading keys..."

    # Lecture correcte des clés
    UNSEAL_KEY=$(jq -r '.unseal_keys_b64[0]' "$INIT_FILE")
    ROOT_TOKEN=$(jq -r '.root_token' "$INIT_FILE")

    # Vérification et Descellement si nécessaire
    if curl -s "$VAULT_ADDR/v1/sys/health" | grep -q '"sealed":true'; then
        echo "[Init] Vault is sealed. Unsealing..."
        for i in $(seq 1 5); do
            vault operator unseal "$UNSEAL_KEY" >/dev/null
            if ! curl -s "$VAULT_ADDR/v1/sys/health" | grep -q '"sealed":true'; then
                echo "[Init] Unsealed successfully."
                break
            fi
            sleep 1
        done
    fi

    if [ ! -f "$TOKEN_FILE" ]; then
        echo -n "$ROOT_TOKEN" > "$TOKEN_FILE"
        chmod 644 "$TOKEN_FILE"
    fi

else
    echo "[Init] First time initialization..."
    INIT_OUTPUT=$(vault operator init -key-shares=1 -key-threshold=1 -format=json)

    echo "$INIT_OUTPUT" > "$INIT_FILE"

    UNSEAL_KEY=$(echo "$INIT_OUTPUT" | jq -r '.unseal_keys_b64[0]')
    ROOT_TOKEN=$(echo "$INIT_OUTPUT" | jq -r '.root_token')

    echo -n "$ROOT_TOKEN" > "$TOKEN_FILE"
    chmod 644 "$TOKEN_FILE"

    echo "[Init] Unsealing..."
    vault operator unseal "$UNSEAL_KEY" >/dev/null
fi

# ----------------------------------------------------------------------
# 2. CONFIGURATION (Idempotent)
# ----------------------------------------------------------------------

echo "[Config] Waiting for active state..."
until curl -s "$VAULT_ADDR/v1/sys/health" | grep -q '"sealed":false'; do
    sleep 1
done

export VAULT_TOKEN="$ROOT_TOKEN"

# A. Activer KV v2
if vault secrets list -format=json | jq -e '."secret/"' >/dev/null; then
    echo "[Config] KV v2 'secret/' engine already enabled."
else
    echo "[Config] Enabling KV v2 at 'secret/'..."
    vault secrets enable -version=2 -path=secret kv
fi

# B. STOCKAGE DES SECRETS DU .ENV
echo "[Config] Injecting secrets from environment..."

# On écrit toutes les variables importantes dans un chemin dédié 'secret/backend/config'
# Note: Les variables $DATABASE_URL, $JWT_SECRET, etc. doivent être passées au conteneur Vault via docker-compose
vault kv put secret/backend/config \
    NODE_ENV="$NODE_ENV" \
    PORT="$PORT" \
    DATABASE_URL="$DATABASE_URL" \
    JWT_SECRET="$JWT_SECRET" \
    FRONT_ORIGIN="$FRONT_ORIGIN" \
    COOKIE_SAMESITE="$COOKIE_SAMESITE" \
    GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
    GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
    GOOGLE_REDIRECT_URI="$GOOGLE_REDIRECT_URI" >/dev/null

echo "[Config] Secrets stored successfully."

# C. Activer AppRole
if vault auth list -format=json | jq -e '."approle/"' >/dev/null; then
    echo "[Config] AppRole auth already enabled."
else
    echo "[Config] Enabling AppRole auth..."
    vault auth enable approle
fi

# D. Configuration Politique (Mise à jour pour accéder à secret/data/backend/*)
echo "[Config] Updating policy 'app-policy'..."
vault policy write app-policy - <<EOF
path "secret/data/backend/*" { capabilities = ["read"] }
EOF

# E. Configuration Rôle
echo "[Config] Updating AppRole 'app'..."
vault write auth/approle/role/app \
    token_policies="app-policy" \
    secret_id_ttl="0" \
    token_num_uses="0" \
    secret_id_num_uses="0" >/dev/null

# ----------------------------------------------------------------------
# 3. RÉGÉNÉRATION DES IDs
# ----------------------------------------------------------------------
echo "[Config] Generating stable AppRole IDs..."

ROLE_ID=$(vault read -field=role_id auth/approle/role/app/role-id)
echo -n "$ROLE_ID" > "$ROLE_ID_FILE"
chmod 666 "$ROLE_ID_FILE"

SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/app/secret-id)
echo -n "$SECRET_ID" > "$SECRET_ID_FILE"
chmod 666 "$SECRET_ID_FILE"

echo "[Success] Vault configured. IDs refreshed in shared volume."
