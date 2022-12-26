export const environment = {
  server: {
    port: process.env.SERVER_PORT || 3333,
  },
  db: {
    url:
      process.env.DB_URL ||
      "mongodb://codedemonbr:123abc@localhost:27017/meat-api",
  },
  security: {
    saltRounds: process.env.SALT_ROUNDS || 10,
    apiSecret: process.env.API_SECRET || "meat-api-secret",
    enableHTTPS: process.env.ENABLE_HTTPS || false,
    certificate: process.env.CERTI_FILE || "./security/keys/cert.pem",
    key: process.env.CERT_KEY_FILE || "./security/keys/key.pem",
  },
  log: {
    level: process.env.LOG_LEVEL || "debug",
    name: "meat-api-logger",
  },
};
