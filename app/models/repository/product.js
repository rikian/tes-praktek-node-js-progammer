const { Sequelize } = require("sequelize")
const ProductEntity = require("../entites/product")

module.exports = class ProductRepository {
    /**
     * 
     * @param {object} param
     * @param {Sequelize} param.sequelize 
     * @param {ProductEntity} param.productEntity
     */
    constructor({sequelize, productEntity}) {
        this.productEntity = productEntity
        this.Product = sequelize.define("products", this.productEntity.attribute, this.productEntity.options)
    }

    /**
     * 
     * @param {object} param
     * @param {string} param.id_barang
     * @param {string} param.nama_barang
     * @param {number} param.harga_beli
     * @param {number} param.harga_jual
     * @param {number} param.stok
     * @param {string} param.gambar_barang
     * @param {string} param.created_at
     * @param {string} param.updated_at
     * @returns
     */
    async insertProduct(param) {
        try {
            const product = await this.Product.create(param)
            return product
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    /**
     * 
     * @returns 
     */
    async getProducts() {
        const products = this.Product.findAll({
            limit: 10,
            raw: true
        })

        return products
    }

    /**
     * 
     * @param {object} param
     * @param {string} param.id_barang
     * @param {string} param.user_id
     * @param {string} param.nama_barang
     * @param {number} param.harga_beli
     * @param {number} param.harga_jual
     * @param {number} param.stok
     * @param {string} param.updated_at
     * @returns 
     */
    async updateProduct({id_barang, user_id, nama_barang, harga_beli, harga_jual, stok, gambar_barang_baru, updated_at}) {
        try {
            const primary_key = {
                "id_barang" : id_barang,
                "user_id" : user_id
            }

            const new_data_product = {
                "nama_barang" : nama_barang,
                "harga_beli" : harga_beli,
                "harga_jual" : harga_jual,
                "stok" : stok,
                "updated_at" : updated_at
            }

            if (gambar_barang_baru) {
                new_data_product["gambar_barang"] = gambar_barang_baru
            }

            const result = await this.Product.update(new_data_product, { where : primary_key })

            if (result[0] == 1) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error.message)
            return false
        }
    }

    async getProductsById() {
        return false
    }

    /**
     * 
     * @param {object} param
     * @param {string} param.user_id
     * @param {string} param.id_barang
     * @returns 
     */
    async deleteProduct({user_id, id_barang}) {
        const product = await this.Product.findByPk(id_barang)
        const primary_key = {
            "id_barang" : id_barang,
            "user_id" : user_id
        }

        const result = await this.Product.destroy({ where : primary_key })
    
        return {result, product}
    }
}