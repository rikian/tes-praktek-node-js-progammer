// load env file
require('dotenv').config()

const server_conf = require('./app/injector/injector')
const server = require('./app/listener')

server(server_conf)
    .listen(server_conf.env.PORT, server_conf.env.ADDRESS, () => console.log(`server listening at ${server_conf.env.ADDRESS}:${server_conf.env.PORT}`))
    .on("error", (err) => console.log(`failed listen at ${server_conf.env.ADDRESS}:${server_conf.env.PORT}. Error : ${err.message}`))