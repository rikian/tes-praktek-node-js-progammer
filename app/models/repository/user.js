const { Sequelize } = require("sequelize")
const UserEntity = require("../entites/user")
const ProductRepository = require("./product")

module.exports = class UserRepository {
    /**
     * 
     * @param {object} param
     * @param {Sequelize} param.sequelize 
     * @param {UserEntity} param.userEntity
     * @param {ProductRepository} param.productRepository
     */
    constructor({sequelize, userEntity, productRepository}) {
        this.productRepository = productRepository
        this.userEntity = userEntity
        this.User = sequelize.define("users", this.userEntity.attribute, this.userEntity.options)
        this.User.hasMany(this.productRepository.Product, {
            foreignKey: "user_id"
        })
    }

    /**
     * 
     * @param {object} obj
     * @param {string} obj.user_id
     * @param {string} obj.user_email
     * @param {string} obj.user_password
     * @param {string} obj.user_name
     * @param {string} obj.created_at
     * @param {string} obj.updated_at
     * @returns 
     */
    async createUser(obj) {
        try {
            const user = await this.User.create(obj)
            return user
        } catch (error) {
            console.log(error.errors[0].message + " - " + error.errors[0].value + " aleady use")
            return false
        }
    }

    /**
     * get user by email and password
     * @param {object} param
     * @param {string} param.email 
     * @param {string} param.password 
     */
    async getUserByEmailAndPassword({email, password}) {
        try {
            const user = await this.User.findOne({ 
                where: { 
                    "user_email": email, 
                    "user_password" : password 
                }
            });
    
            return user
        } catch (error) {
            console.log(error.errors[0].message)
            return false
        }
    }
    
    /**
     * 
     * @param {string} id 
     * @returns 
     */
    async getUserById(id) {
        try {
            // const user = await this.User.findByPk(id);
            const user = await this.User.findOne({
                where : {"user_id" : id},
                include : this.productRepository.Product
            })
    
            return user
        } catch (error) {
            console.log(error.errors[0].message)
            return false
        }
    }
    
    /**
     * 
     * @param {object} param
     * @param {string} param.user_id
     * @param {string} param.session
     * @returns 
     */
    async saveSessionUser({user_id, session}) {
        try {
            const userSession = {"user_session" : session}
            const dataUser = { 
                "user_id": user_id
            }

            const result = await this.User.update(userSession, { where: dataUser});

            if (result[0] == 1) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error.errors[0].message)
            return false
        }
    }

    /**
     * 
     * @param {string} user_id 
     * @returns 
     */
    async deleteSession(user_id) {
        try {
            const userSession = {"user_session" : ""}
            const dataUser = {"user_id": user_id}

            const result = await this.User.update(userSession, { where: dataUser});

            if (result[0] == 1) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error.errors[0].message)
            return false
        }
    }
}