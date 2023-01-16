const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const validator = require("validator")

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

    isValidEmail(str) {
        try {
            return validator.default.isEmail(str)
        } catch (error) {
            return false
        }
    }

    isEmty(str) {
        try {
            return validator.default.isEmpty(str)
        } catch (error) {
            return false
        }
    }

    isUUID(str) {
        try {
            return validator.default.isUUID(str, 4)
        } catch (error) {
            return false
        }
    }
    
    /**
     * 
     * @param {object} p 
     * @param {string} p.email_login
     * @param {string} p.password_login
     * @returns 
     */
    validationDataLogin(p) {
        try {
            if (validator.default.isEmpty(p.email_login)) return false
            if (validator.default.isEmpty(p.password_login)) return false
            
            if (p.email_login.length > 32) return false
            if (p.password_login.length < 7) return false

            if (!this.isValidEmail(p.email_login)) return false

            return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    /**
     * 
     * @param {object} p 
     * @param {string} p.r_name
     * @param {string} p.r_email
     * @param {string} p.r_password1
     * @param {string} p.r_password2
     * @returns 
     */
    validationDataRegister(p) {
        try {
            if (validator.default.isEmpty(p.r_name)) return false
            if (validator.default.isEmpty(p.r_email)) return false
            if (validator.default.isEmpty(p.r_password1)) return false
            if (validator.default.isEmpty(p.r_password2)) return false

            if (p.r_password1.length < 7 || p.r_password2.length < 7) return false
            if (p.r_password1 !== p.r_password2) return false

            if (p.r_name.length > 32) return false

            const user_name = p.r_name.replace(/\s/g, "")

            if (!validator.default.isAlpha(user_name)) {
                if (!validator.default.isAlphanumeric(user_name)) {
                    return false
                }
            }

            if (!this.isValidEmail(p.r_email)) return false

            return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    /**
     * 
     * @param {object} p
     * @param {string} p.nama_barang
     * @param {number} p.harga_beli
     * @param {number} p.harga_jual
     * @param {number} p.stok
     */
    validationDataProduct(p) {
        try {
            if (validator.default.isEmpty(p.nama_barang)) return false
            if (validator.default.isEmpty(p.harga_beli)) return false
            if (validator.default.isEmpty(p.harga_jual)) return false
            if (validator.default.isEmpty(p.stok)) return false
            if (p.nama_barang.length > 64) return false
            if (p.nama_barang.match(/[`~!@#$%^&*()\-_+={}\[\]\|\\;:"'<>,.?]/)) return false
            if (p.harga_beli.length > 15) return false
            if (p.harga_jual.length > 15) return false
            if (p.stok.length > 15) return false
            if (validator.default.isNumeric(p.harga_beli))
            if (validator.default.isNumeric(p.harga_jual))
            if (validator.default.isNumeric(p.stok))

            return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    /**
     * 
     * @param {object} files
     * @param {object} files.gambar_barang
     * @param {string} files.gambar_barang.mimetype
     */
    validationImageProduct(files) {
        try {
            if (validator.default.isEmpty(files.gambar_barang.mimetype)) return false
            
            switch (files.gambar_barang.mimetype) {
                case "image/jpeg":
                    return true
                case "image/jpg":
                    return true
                case "image/png":
                    return true
                default:
                    return false
            }
        } catch (error) {
            console.log(error.message)
            return false
        }
    }
}