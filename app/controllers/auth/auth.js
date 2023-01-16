const Helper = require("../../helper/helper")
const UserRepository = require("../../models/repository/user")
const express = require("express")
const uuid = require("uuid")

module.exports = class ControllerAuth {
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
    async register(req, res) {
        if (Object.values(req.body).length == 0) {
            return res.status(400).end()
        }

        const validationDataRegistration = this.helper.validationDataRegister(req.body)

        if (!validationDataRegistration) {
            return res.status(400).end()
        }

        const date = new Date()

        const dataRegisterUser = {
            "user_id" : uuid.v4(),
            "user_name" : req.body["r_name"],
            "user_email" : req.body["r_email"],
            "user_password" : this.helper.sha256(req.body["r_password1"]),
            "created_at": date.toString(),
            "updated_at": date.toString()
        }

        const result = await this.repoUser.createUser(dataRegisterUser)

        if (!result) return res.status(400).end()

        return res.status(200).json({"user_email" : req.body["r_email"], "user_name" : req.body["r_name"]})
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    async login(req, res) {
        if (req["authentication"]) return res.status(400).end()

        const validationDataLogin = this.helper.validationDataLogin(req.body)

        if (!validationDataLogin) {
            return res.status(400).json({status:"bad request"})
        }
        
        const user = await this.repoUser.getUserByEmailAndPassword({
            "email" : req.body["email_login"], 
            "password" : this.helper.sha256(req.body["password_login"])
        })

        if (!user) {
            return res.status(404).json({status:"not found"})
        }

        // create session user
        const session = this.helper.encodeJwtSession(user.user_id)
        
        if (!session) {
            return res.status(500).json({status:"internal server error"})
        }
        
        // save session to dbuser
        const statusSaveSessionUser = await this.repoUser.saveSessionUser({
            user_id : user["user_id"], 
            session : session
        })
        
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

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    async logout(req, res) {
        if (req["user"] && req.authentication) {
            const statusDeleteSession = await this.repoUser.deleteSession(req["user"].user_id)
    
            if (!statusDeleteSession) return res.status(500).end()
    
            return res.status(200).end()
        } else {
            return res.status(400).end()
        }
    }
}