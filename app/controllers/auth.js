const Helper = require("../helper/helper")
const UserRepository = require("../models/repository/user")
const express = require("express")

module.exports = class controllerAuth {
    /**
     * 
     * @param {UserRepository} repoUser 
     * @param {Helper} helper 
     */
    constructor(repoUser, helper) {
        this.repoUser = repoUser
        this.helper = helper
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    login(req, res) {
        if (req["authentication"]) return res.status(400).end()

        const dataLogin = req.body

        if (!dataLogin["email_login"] || !dataLogin["password_login"]) {
            return res.status(400).json({status:"bad request"})
        }
        
        const user = this.repoUser.getUser(dataLogin["email_login"], dataLogin["password_login"])

        if (!user) {
            return res.status(404).json({status:"not found"})
        }

        // create session user
        const session = this.helper.encodeJwtSession(user.user_id)
        
        if (!session) {
            return res.status(500).json({status:"internal server error"})
        }
        
        // save session to dbuser
        const statusSaveSessionUser = this.repoUser.saveSessionUser(dataLogin["email_login"], dataLogin["password_login"], session)
        
        if (!statusSaveSessionUser) {
            return res.status(500).json({status:"internal server error"})
        }

        // parse jwt token
        const sessionParts = this.helper.splitStr(session, ".")

        if (!sessionParts || sessionParts.length !== 3) {
            return res.status(500).json({status:"internal server error"})
        }

        // set expires cookie for 30 minute
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 30);

        // set token part to cookie
        const sessionCookie = `session=${sessionParts[2]};path=/;expires=${expires};httponly;`
        const idCookie = `id=${user.user_id};path=/;expires=${expires};httponly;`

        res.setHeader("set-cookie", [sessionCookie, idCookie]);
        res.json({status:"ok"})
    }

    logout(req, res) {
        if (req["user"] && req.authentication) {
            const statusDeleteSession = this.repoUser.deleteSession(req["user"].user_id)
    
            if (!statusDeleteSession) return res.status(500).end()
    
            return res.status(200).end()
        } else {
            return res.status(400).end()
        }
    }
}