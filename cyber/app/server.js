const express = require("express");
const axios = require("axios");

const app = express();
const port = 3000;

const VAULT = "http://vault:8200";
const PATH = process.env.VAULT_SECRET_PATH;
const VAULT_TOKEN = process.env.VAULT_TOKEN || "root"; // Token Vault, par défaut root en dev

app.get('/', (req, res) => {
    res.json({ status: "OK", message: "Use /api/secret to retrieve data." });
});

app.get("/api/secret", async (req, res) => {
  try {
    const response = await axios.get(`${VAULT}/v1/secret/data/my-secret`, {
      headers: {
        "X-Vault-Token": VAULT_TOKEN
      }
    });

    res.json({
      message: "App OK",
      secret: response.data.data.data.value
    });
  } catch (error) {
    res.json({ error: error.response?.statusText || error.message });
  }
});

app.listen(port, () => console.log(`App running on port ${port}`));
