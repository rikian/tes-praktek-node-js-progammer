const Sequelize = require('sequelize');

module.exports = class UserEntity {
    constructor() {
        this.attribute = {
            user_id: {
                primaryKey: true,
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            user_email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            user_password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            user_image: {
                type: Sequelize.STRING,
                defaultValue: "default-profile.svg"
            },
            user_session: {
                type: Sequelize.STRING
            },
            created_at: {
                type: Sequelize.STRING,
            },
            updated_at: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }

        this.options = {
            createdAt: false,
            updatedAt: false,
        }
    }
}