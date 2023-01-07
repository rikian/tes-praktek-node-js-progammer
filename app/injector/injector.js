/**
 * This file for dependencies injection
*/
const Middleware = require("../middleware/middleware")
const ControllerResponse = require("../controllers")
const ControllerAuth = require("../controllers/auth")
const ControllerProduct = require("../controllers/product")
const UserRepository = require("../models/repository/user")
const ProductRepository = require("../models/repository/product")
const Helper = require("../helper/helper")

const env = {
    "PORT" : process.env.PORT || 9091,
    "ADDRESS" : process.env.ADDRESS || "0.0.0.0",
    "STATUS" : process.env.STATUS === "" || process.env.STATUS !== "PRODUCTION" ? "DEVELOPMENT" : process.env.STATUS,
    "JWT_SECRET_KEY" : !process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY === "" ? "e19c26220938b93064126f259a4564b3" : process.env.JWT_SECRET_KEY,
    "MAGIC_KEY_SHA256" : !process.env.MAGIC_KEY_SHA256 || process.env.MAGIC_KEY_SHA256 === "" ? "--BULU_KNTL_001--" : process.env.MAGIC_KEY_SHA256,
}

const helper = new Helper(env.JWT_SECRET_KEY, env.MAGIC_KEY_SHA256)
const userRepository = new UserRepository(helper)
const productRepository = new ProductRepository()
const controllerResponse = new ControllerResponse(productRepository)
const controllerAuth = new ControllerAuth(userRepository, helper)
const controllerProduct = new ControllerProduct(userRepository, productRepository, helper)
const middleware = new Middleware(userRepository, controllerResponse, helper)

// export configuration server
module.exports = {
    env,
    middleware,
    controllerAuth,
    controllerProduct,
    controllerResponse,
}