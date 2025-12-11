FROM node:18
WORKDIR /app
COPY server.js .

RUN apt-get update && apt-get install -y curl jq \
    && rm -rf /var/lib/apt/lists/*

RUN npm init -y && npm install express axios
CMD ["node", "server.js"]
