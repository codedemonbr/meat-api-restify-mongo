export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3333,
    },
    db: {
        url:
            process.env.DB_URL ||
            "mongodb://meatUser:123456@172.18.0.2:27017/meat-api",
    },
    security: {
        saltRounds: process.env.SALT_ROUNDS || 10,
    },
};
