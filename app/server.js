const express = require("express");
const { middleware } = require("./middleware");
const cookieParser = require("cookie-parser")
const app = express()
const { router } = require("./router/router");

function run(port, address) {
    app.get("/", (req, res) => res.send("hello"))
    // app.use(cookieParser())
    // app.set("view engine", "ejs");
    // app.use("/public/", express.static("static"));
    // app.use("/plugins/", express.static("static/adminlte/plugins"));
    // app.use("/dist/", express.static("static/adminlte/dist"));
    // app.use("/media/", express.static("media"));
    // app.use((req, res, next) => middleware(req, res, next))
    // app.use("/", router)
    app.listen(port, () => console.log("server listening on port " + port)).on("error", (err) => console.log(`failed listen at 127.0.0.0:${port}. Error : ${err.message}`))
}

module.exports = { run }