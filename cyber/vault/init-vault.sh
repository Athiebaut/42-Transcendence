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
    UNSEAL_KEY=$(jq -r '.keys_base64[0]' "$INIT_FILE")
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
    
    # Restauration du fichier token si perdu (redémarrage conteneur)
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

    # Sauvegarde Token
    echo -n "$ROOT_TOKEN" > "$TOKEN_FILE"
    chmod 644 "$TOKEN_FILE"

    echo "[Init] Unsealing..."
    vault operator unseal "$UNSEAL_KEY" >/dev/null
fi

# ----------------------------------------------------------------------
# 2. CONFIGURATION (Idempotent - Peut tourner en boucle sans erreur)
# ----------------------------------------------------------------------

# Attente que Vault soit totalement actif
echo "[Config] Waiting for active state..."
until curl -s "$VAULT_ADDR/v1/sys/health" | grep -q '"sealed":false'; do
    sleep 1
done

# Authentification CLI
export VAULT_TOKEN="$ROOT_TOKEN"

# A. Activer KV v2 sur 'secret/' (Seulement si pas déjà monté)
if vault secrets list -format=json | jq -e '."secret/"' >/dev/null; then
    echo "[Config] KV v2 'secret/' engine already enabled."
else
    echo "[Config] Enabling KV v2 at 'secret/'..."
    vault secrets enable -version=2 -path=secret kv
fi

# B. Écrire/Mettre à jour le secret (Toujours écraser pour garantir la présence)
echo "[Config] Writing secret data..."
vault kv put secret/my-secret value=ma_cle_secrete >/dev/null

# C. Activer AppRole (Seulement si pas déjà activé)
if vault auth list -format=json | jq -e '."approle/"' >/dev/null; then
    echo "[Config] AppRole auth already enabled."
else
    echo "[Config] Enabling AppRole auth..."
    vault auth enable approle
fi

# D. Configuration Politique (Toujours écraser)
echo "[Config] Updating policy 'app-policy'..."
vault policy write app-policy - <<EOF
path "secret/data/my-secret" { capabilities = ["read"] }
EOF

# E. Configuration Rôle (Toujours écraser pour être sûr des paramètres)
echo "[Config] Updating AppRole 'app'..."
vault write auth/approle/role/app \
    token_policies="app-policy" \
    secret_id_ttl="0" \
    token_num_uses="0" \
    secret_id_num_uses="0" >/dev/null

# ----------------------------------------------------------------------
# 3. RÉGÉNÉRATION DES IDs (Pour l'application)
# ----------------------------------------------------------------------
echo "[Config] Generating stable AppRole IDs..."

# Récupérer Role ID
ROLE_ID=$(vault read -field=role_id auth/approle/role/app/role-id)
echo -n "$ROLE_ID" > "$ROLE_ID_FILE"
chmod 666 "$ROLE_ID_FILE"

# Générer un nouveau Secret ID (Valide pour toujours grâce à la config ci-dessus)
SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/app/secret-id)
echo -n "$SECRET_ID" > "$SECRET_ID_FILE"
chmod 666 "$SECRET_ID_FILE"

echo "[Success] Vault configured. IDs refreshed in shared volume."