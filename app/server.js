const express = require("express");
const { middleware } = require("./middleware");
const cookieParser = require("cookie-parser")
const app = express()
const { router } = require("./router/router");
const http = require("http");
const { handlerUpgrade } = require("./socket/middleware");
const socket = http.createServer(app)

function run(port) {
    app.use(cookieParser())
    app.set("view engine", "ejs");
    app.use("/public/", express.static("static"));
    app.use("/static/", express.static("static/adminlte"));
    app.use("/media/", express.static("media"));
    app.use((req, res, next) => middleware(req, res, next))
    app.use("/", router)
    socket.on("upgrade", (req, socket, head) => handlerUpgrade(req, socket, head))
    socket.listen(process.env.PORT || port, "0.0.0.0", () => console.log("server listening on port " + port)).on("error", (err) => console.log(`failed listen at 127.0.0.0:${port}. Error : ${err.message}`))
}

module.exports = { run, app }