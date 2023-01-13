const server_conf = require('./app/injector/injector')
const server = require('./app/app')

server(server_conf)
    .listen(server_conf.env.PORT, server_conf.env.ADDRESS, async () => {
        try {
            await server_conf.sequelize.authenticate()
            console.log(`postgrest listening at ${server_conf.env.database_config.host}:${server_conf.env.database_config.port}`)
            console.log(`server listening at ${server_conf.env.ADDRESS}:${server_conf.env.PORT}`)
        } catch (error) {
            throw new Error(`${error.message}, failed listening postgres at ${server_conf.env.database_config.host}:${server_conf.env.database_config.port}`)
        }
    })
    .on("error", (err) => console.error(`failed listen at ${server_conf.env.ADDRESS}:${server_conf.env.PORT}. Error : ${err.message}`))