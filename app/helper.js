const jwt = require('jsonwebtoken');
const secretKey = "feb7b462b6b572859a94488054c25693dd7a6e37bd66ee91a2022e3b891f12359323cd476e35c2c8436fe9e232031c88fdb1c26003554debbbdd70fb7d83480c"
const jwtTokenLogin = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoicmlraWFuIiwiaWF0IjoxNjU4MzkyNzMwfQ.KcUv7hlTh7zKwPB0J3E5P0ChbPGvP-d9q_4tz5g6uGw"

function createTokenLogin() {
    const token = jwtTokenLogin.split(".")
    return token[1]
}

function valTokenLogin(token_part) {
    const token = jwtTokenLogin.split(".")
    return token[1]
}

function encodeToken(str) {
    try {
        const obj = JSON.stringify(str)
        const token = jwt.sign(obj, secretKey);
        return token
    } catch (error) {
        return false
    }
}

function decodeToken(token) {
    try {
        jwt.verify(token, secretKey);
        return true
    } catch (error) {
        return false
    }
}


module.exports = { encodeToken, decodeToken }