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
    async init(req, next) {
        const cookies = req.cookies
        
        if (!cookies["id"] || !cookies["session"]) return next()

        const user = await this.userRepository.getUserById(cookies.id)

        if (!user || user == null || !user["dataValues"]) return next()

        // check authentication
        const isAuthentication = this.checkAuth(user, cookies, this.helper)

        if (!isAuthentication) return next()

        // inject user to request
        req["user"] = user.dataValues
        req["authentication"] = true

        return next()
    }

    /**
     * 
     * @param {object} param
     * @param {express.Request} param.req 
     * @param {express.Response} param.res 
     * @param {express.NextFunction} param.next 
     * @returns {express.NextFunction}
     */
    apiMiddleware({req, res, next}) {
        if (req["user"] && req.authentication && req.headers["content-type"]) {
            return next()
        } else {
            return res.status(404).end()
        }
    }

    /**
     * 
     * @param {object} user 
     * @param {Helper} helper 
     * @returns 
    */
    checkAuth(user, cookies, helper) {
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
}