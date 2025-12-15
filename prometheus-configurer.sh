#!/bin/bash

DOCKER_COMPOSE_FILE="./docker-compose.yml"
PROMETHEUS_TEMPLATE="monitoring/prometheus/prometheus_template.yml"
PROMETHEUS_CONFIG="monitoring/prometheus/prometheus.yml"

sed -i '/^USER_ID_MONITORING=/d' .env
echo "
" >> .env
echo "USER_ID_MONITORING=$(id -u)" >> .env

if [[ ! -f "$DOCKER_COMPOSE_FILE" ]]; then
    echo "Erreur: Le fichier $DOCKER_COMPOSE_FILE n'existe pas."
    exit 1
fi

if [[ ! -f "$PROMETHEUS_TEMPLATE" ]]; then
    echo "Erreur: Le fichier $PROMETHEUS_TEMPLATE n'existe pas."
    exit 1
fi

# grep et sed pour extraire les container_name
CONTAINERS=$(grep -E '^\s*container_name:\s*' "$DOCKER_COMPOSE_FILE" | sed 's/.*container_name:\s*//' | sed 's/["\x27]//g' | tr -d ' ')

cp "$PROMETHEUS_TEMPLATE" "monitoring/prometheus/prometheus.yml"

echo "" >> "$PROMETHEUS_CONFIG"

while IFS= read -r container; do
    if grep -q "job_name: $container" "$PROMETHEUS_CONFIG"; then
        continue
    fi
    cat >> "$PROMETHEUS_CONFIG" << EOF

- job_name: $container
  honor_timestamps: true
  static_configs:
    - targets:
        - $container:9100
EOF

done <<< "$CONTAINERS"

while IFS= read -r container; do

TIMEOUT=120
ELAPSED=0

while [ "$(docker inspect -f '{{.State.Running}}' $container 2>/dev/null)" != "true" ]; do
    if [ $ELAPSED -ge $TIMEOUT ]; then
		break
    fi
    sleep 5
    ELAPSED=$((ELAPSED + 5))
done

docker exec $container /bin/sh -c "
apk update && apk upgrade && apk add curl
curl -L -O https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar -zxvf node_exporter-1.9.1.linux-amd64.tar.gz
mv node_exporter-1.9.1.linux-amd64/node_exporter /node_exporter
/node_exporter > /dev/null 2>&1 &
" > /dev/null 2>&1 


done <<< "$CONTAINERS"
