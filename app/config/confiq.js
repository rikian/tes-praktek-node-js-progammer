const address = "127.0.0.1"
const port = process.env.PORT || 9091
const host = `http://${address}:${port}`

module.exports = { host, port, address }