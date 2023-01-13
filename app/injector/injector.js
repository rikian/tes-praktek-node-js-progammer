/**
 * This file for dependencies injection
*/

// load env file
require('dotenv').config()

const Middleware = require("../middleware/middleware")
const ControllerResponse = require("../controllers")
const ControllerAuth = require("../controllers/auth/auth")
const ControllerProduct = require("../controllers/products/product")
const UserRepository = require("../models/repository/user")
const ProductRepository = require("../models/repository/product")
const Helper = require("../helper/helper")
const sequelizeInit = require("../config/database")
const UserEntity = require("../models/entites/user")
const ProductEntity = require("../models/entites/product")
const env = require("../config/env")

// initial database connection
const helper = new Helper(env.JWT_SECRET_KEY, env.MAGIC_KEY_SHA256)
const sequelize = sequelizeInit(env.database_config)

const productEntity = new ProductEntity()
const userEntity = new UserEntity()

const productRepository = new ProductRepository({sequelize, productEntity})

const userRepository = new UserRepository({sequelize, userEntity, productRepository})

const controllerResponse = new ControllerResponse(productRepository)
const controllerAuth = new ControllerAuth(userRepository, helper)
const controllerProduct = new ControllerProduct({productRepository, helper})
const middleware = new Middleware(userRepository, controllerResponse, helper)

// export configuration server
module.exports = {
    env,
    middleware,
    controllerAuth,
    controllerProduct,
    controllerResponse,
    sequelize
}