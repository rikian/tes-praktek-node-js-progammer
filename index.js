const { run } = require("./app/server")
const { port, address } = require("./app/config/confiq")
run(port, address)