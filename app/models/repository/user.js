const { writeFileSync } = require("fs")
const dbUser = require("../database-json/users.json")

module.exports = class UserRepository {
    constructor(helper) {
        this.helper = helper
    }

    /**
     * get user by email and password
     * @param {string} email 
     * @param {string} password 
     */
    getUser(email, password) {
        const user = dbUser.find(data => data["user_email"] === email && data["user_password"] === this.helper.sha256(password))
    
        if (!user) return false
    
        return user
    }
    
    /**
     * 
     * @param {string} id 
     * @returns 
     */
    getUserById(id) {
        const user = dbUser.find(data => data["user_id"] === id)
   
        if (!user) return false
    
        return user
    }
    
    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {string} jwtToken 
     * @returns 
     */
    saveSessionUser(email, password, jwtToken) {
        try {
            const user = this.getUser(email, password)
        
            if (!user) return false
        
            user.user_session = jwtToken
        
            updateDBUser()
    
            return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    deleteSession(user_id) {
        const user = this.getUserById(user_id)

        if (!user) return false

        user.user_session = ""

        updateDBUser()

        return true
    }
}

function updateDBUser() {
    try {
        writeFileSync("./app/models/database-json/users.json", JSON.stringify(dbUser), "utf-8")

        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}