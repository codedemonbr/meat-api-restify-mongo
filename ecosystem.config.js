module.exports = {
  apps: [
    {
      name: "meat-api",
      script: "./dist/main.js",
      instances: 0,
      exec_mode: "cluster",
      watch: true,
      merge_logs: true,
      env: {
        SERVER_PORT: 5000,
        DB_URL: "mongodb://codedemonbr:123abc@localhost:27017/meat-api",
        NODE_ENV: "development",
        SALT_ROUNDS: 10,
        API_SECRET: "meat-api-secret",
        ENABLE_HTTPS: true,
        CERTI_FILE: "./security/keys/cert.pem",
        CERT_KEY_FILE: "./security/keys/key.pem",
      },
      env_production: {
        SERVER_PORT: 5001,
        NODE_ENV: "production",
      },
    },
  ],
};
