module.exports = env = {
    "PORT" : process.env.PORT || 9091,
    "ADDRESS" : process.env.ADDRESS || "0.0.0.0",
    "STATUS" : process.env.STATUS === "" || process.env.STATUS !== "PRODUCTION" ? "DEVELOPMENT" : process.env.STATUS,
    "JWT_SECRET_KEY" : !process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY === "" ? "e19c26220938b93064126f259a4564b3" : process.env.JWT_SECRET_KEY,
    "MAGIC_KEY_SHA256" : !process.env.MAGIC_KEY_SHA256 || process.env.MAGIC_KEY_SHA256 === "" ? "--BULU_KNTL_001--" : process.env.MAGIC_KEY_SHA256,
    database_config : {
        "dialect": process.env.DIALECT,
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "host": process.env.DB_HOST,
        "port" : process.env.DB_PORT,
        "database": process.env.DB_NAME,
    }
}