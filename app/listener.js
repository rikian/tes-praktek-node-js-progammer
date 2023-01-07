const express = require("express")
const cors = require('cors')
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const config = require("./injector/injector")

/**
 * @param {config} config
 * @returns {express.Application}
 */
module.exports = function (config) {
    // init express
    const app = express()

    /*
    *   for parsing req.headers.cookie and set up max size to 1kb
    */
    app.use(cookieParser(Buffer.alloc(1024)))

    /*
        for parsing req.body and set up max size to 2kb
    */
    app.use(bodyParser.json({limit: "2kb"}))
    app.use(bodyParser.urlencoded({ limit:"2kb", extended: true }))
    
    /* 
        check if status is production or development
    */
    if (config.env.STATUS === "PRODUCTION") {
        app.use("/", cors({
            origin: "https://example.com" // your host
        }))
    } else {
        app.use("/", cors({
            origin: "*"
        }))
    }
    
    app.set("view engine", "ejs");

    // logging
    app.use("/", (req, res, next) => {
        const date = new Date()
        console.log(`${date}-${req.ip} ${req.method} ${req.url}`)
        return next()
    })

    // global static without authentication
    app.use("/static/", express.static("static"));
    app.use("/media/", express.static("media/upload"));

    // authentication for login and product
    app.use("/", (req, res, next) => config.middleware.init(req, next))

    // home handler
    app.get("/", (req, res) => config.controllerResponse.home(req, res))

    // Api auth handler
    app.post("/auth/login/", (req, res) => config.controllerAuth.login(req, res))
    app.post("/auth/logout/", (req, res) => config.controllerAuth.logout(req, res))
    
    // check auth in request before hit API Product
    app.use(("/api/products/"), (req, res, next) => config.middleware.apiProductMiddleware(req, res, next))

    // API Product
    app.get("/api/products/"), (req, res) => config.controllerProduct.handlerGetProducts(req, res)
    app.post("/api/products/", (req, res) => config.controllerProduct.handlerInsertProduct(req, res))
    app.put("/api/products/", (req, res) => config.controllerProduct.handlerUpdateProduct(req, res))
    app.delete("/api/products/", (req, res) => config.controllerProduct.handlerDeleteProduct(req, res))

    return app
}