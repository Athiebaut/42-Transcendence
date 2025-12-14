#!/bin/sh
# app/wait_for_vault.sh
set -e

VAULT_ADDR=${VAULT_ADDR:-http://vault:8200}
ROLE_ID_FILE="/app/config_input/role_id.txt"
SECRET_ID_FILE="/app/config_input/secret_id.txt"

echo "Waiting for Vault to be ready..."

# 1. Attendre que Vault soit initialisé et descellé
# Ce check est maintenant redondant grâce au healthcheck Docker, mais nous le gardons.
until curl -s $VAULT_ADDR/v1/sys/health | grep '"sealed":false'; do
    echo "Waiting for Vault initialization and unseal..."
    sleep 5
done

echo "Vault is ready (Unsealed). Starting AppRole authentication..."

# 2. Attendre et Charger les IDs de l'AppRole (créés par init-vault.sh)
echo "Waiting for AppRole IDs from Vault..."
until [ -f "$ROLE_ID_FILE" ] && [ -f "$SECRET_ID_FILE" ]; do
    sleep 1
done

sleep 1 # Délai de sécurité pour la synchronisation du volume

echo "AppRole IDs loaded."

# Lecture SIMPLE des IDs (doit fonctionner avec chmod 666)
ROLE_ID=$(cat "$ROLE_ID_FILE")
SECRET_ID=$(cat "$SECRET_ID_FILE")

# 3. Authentification AppRole (Obtenir un jeton temporaire)
echo "Authenticating via AppRole..."

LOGIN_PAYLOAD='{"role_id": "'"$ROLE_ID"'", "secret_id": "'"$SECRET_ID"'"}'

echo "DEBUG: Sending payload: $LOGIN_PAYLOAD" 

VAULT_LOGIN_RESPONSE=$(curl -s --request POST \
    --data "$LOGIN_PAYLOAD" \
    $VAULT_ADDR/v1/auth/approle/login)

# Extraire le jeton de connexion temporaire
export VAULT_TOKEN=$(echo "$VAULT_LOGIN_RESPONSE" | jq -r '.auth.client_token')

if [ -z "$VAULT_TOKEN" ] || [ "$VAULT_TOKEN" = "null" ]; then
    echo "ERROR: Failed to obtain client token from Vault. Vault response:"
    echo "$VAULT_LOGIN_RESPONSE"
    exit 1
fi

echo "Temporary Vault client token loaded successfully. Starting application..."

# 4. Démarrer l'application avec le jeton temporaire VAULT_TOKEN
exec "$@"