const jwt = require('jsonwebtoken');
const crypto = require("crypto")

module.exports = class Helper {
    /**
     * 
     * @param {string} JWT_SECRET_KEY 
     * @param {string} MAGIC_KEY_SHA256 
     */
    constructor(JWT_SECRET_KEY, MAGIC_KEY_SHA256) {
        this.JWT_SECRET_KEY = JWT_SECRET_KEY
        this.MAGIC_KEY_SHA256 = MAGIC_KEY_SHA256
    }

    /**
     * 
     * @param {string} str 
     * @param {string} delim 
     * @returns 
    */
    splitStr(str, delim) {
        try {
            return str.split(delim)
        } catch (error) {
            return false
        }
    }

    /**
     * 
     * @param {string} numstr string contain number "12345" == true
     * @returns
     */
    srtToInt(numstr) {
        try {
            const int = parseInt(numstr);
        
            if (Number.isNaN(int)) return false

            return int
        } catch (error) {
            console.log(error.message)
            return false
        }
    }   

    /**
     * 
     * @param {string} id 
     * @param {number} expired 
     * @returns
    */
    encodeJwtSession(userId, expired) {
        try {
            const obj = JSON.stringify({
                // add ip for production
                "user_id":userId
            })

            let token

            // set expired if need
            if (expired) {
                token = jwt.sign(obj, this.JWT_SECRET_KEY, {
                    expiresIn: expired
                });
            } else {
                token = jwt.sign(obj, this.JWT_SECRET_KEY);
            }
            return token
        } catch (error) {
            return false
        }
    }

    /**
     * 
     * @param {string} jwtStr 
     * @returns 
     */
    decodeJwtSession(jwtStr) {
        try {
            const jwtSession = jwt.verify(jwtStr, this.JWT_SECRET_KEY)
            return jwtSession
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    /**
     * 
     * @param {string} password 
     * @returns 
     */
    sha256(password) {
        const hmac = crypto.createHmac('sha256', this.MAGIC_KEY_SHA256).update(password).digest('hex');

        return hmac
    }
}