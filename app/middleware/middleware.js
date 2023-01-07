const express = require("express")
const UserRepository = require("../models/repository/user")
const ControllerResponse = require("../controllers/index")
const Helper = require("../helper/helper")

module.exports = class Middleware {
    /**
     * @param {UserRepository} userRepository 
     * @param {ControllerResponse} controllerResponse
     * @param {Helper} helper
     */
    constructor(userRepository, controllerResponse, helper) {
        this.userRepository = userRepository
        this.controllerResponse = controllerResponse
        this.helper = helper
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.NextFunction} next 
     * @returns {express.NextFunction}
     */
    init(req, next) {
        const cookies = req.cookies
        if (!cookies["id"] || !cookies["session"]) {
            if (req.url === "/auth/login/") {
                return next()
            }

            return next()
        }

        const user = this.userRepository.getUserById(cookies.id)

        if (!user) return next()

        // check authentication
        const isAuthentication = checkAuth(user, cookies, this.helper)

        if (!isAuthentication) return next()

        // inject user to request
        req["user"] = user
        req["authentication"] = true

        return next()
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * @returns {express.NextFunction}
     */
    apiProductMiddleware(req, res, next) {
        if (req["user"] && req.authentication) {
            return next()
        } else {
            return res.status(404).end()
        }
    }
}

/**
 * 
 * @param {object} user 
 * @param {Helper} helper 
 * @returns 
 */
function checkAuth(user, cookies, helper) {
    try {
        const sessionParts = helper.splitStr(user["user_session"], ".")

        if (!sessionParts || sessionParts.length !== 3 || sessionParts[2] !== cookies.session) {
            return false
        }

        // decode jwt session
        const sessionUser = helper.decodeJwtSession(user["user_session"])

        if (!sessionUser || !sessionUser["user_id"] || sessionUser["user_id"] !== cookies.id) {
            return false
        }

        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}