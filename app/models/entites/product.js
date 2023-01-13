const Sequelize = require('sequelize');

module.exports = class ProductEntity {
    constructor() {
        this.attribute = {
            id_barang: {
                primaryKey: true,
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                  "model" : "users",
                  "key" : "user_id",
                },
                onDelete: "cascade",
                onUpdate: "cascade"
            },
            nama_barang: {
                type: Sequelize.STRING,
                unique: false,
                allowNull: false,
            },
            harga_beli: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            harga_jual: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            stok: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            gambar_barang: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "default-product.jpg"
            },
            created_at: {
                type: Sequelize.STRING,
                allowNull: false,
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
