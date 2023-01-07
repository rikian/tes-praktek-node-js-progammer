const { writeFileSync } = require("fs")
const newDataProducts = require("../database-json/product.json")

module.exports = class ProductRepository {
    constructor() {}

    /**
     * 
     * @returns 
     */
    getProducts() {
        return newDataProducts
    }

    getProduct({user_id, id_barang}) {
        const product = newDataProducts.find(data => data.user_id === user_id && data.id_barang === id_barang)

        if(!product) return false

        return product
    }

    getProductsById(user_id) {
        const userProducts = []

        for (let i = 0; i < newDataProducts.length; i++) {
            if(newDataProducts[i].user_id === user_id) {
                userProducts.push(newDataProducts[i])
            }
        }

        return userProducts
    }

    /**
     * 
     * @param {string} id 
     * @returns 
     */
    deleteProduct({user_id, id_barang}) {
        const product = this.getProduct({user_id, id_barang})
        const indexProduct = newDataProducts.findIndex( data => data.user_id === user_id && data.id_barang === id_barang )
    
        if (indexProduct === -1) return false
    
        newDataProducts.splice(indexProduct, 1)
    
        save()
    
        return product
    }

    /**
     * 
     * @param {object} jsonObj 
     * @returns 
     */
    insertProduct(dataProduct) {
        try {
            newDataProducts.push(dataProduct)
    
            save()
    
            return true
        } catch (error) {
            return false
        }
    }
    
    updateProduct(jsonObj) {
        try {
            const dataProduct = newDataProducts.find(data => data.user_id === jsonObj.user_id && data.id_barang === jsonObj.id_barang)

            if (!dataProduct) return false

            dataProduct.user_id = jsonObj.user_id
            dataProduct.id_barang = jsonObj.id_barang
            dataProduct.nama_barang = jsonObj.nama_barang
            dataProduct.harga_beli = jsonObj.harga_beli
            dataProduct.harga_jual = jsonObj.harga_jual
            dataProduct.stok = jsonObj.stok

            if (jsonObj.gambar_barang_baru) {
                dataProduct.gambar_barang = jsonObj.gambar_barang_baru
            }

            save()

            return true
        } catch (error) {
            console.log(error.message)
            return false
        }
    }
}

/**
 * 
 * @returns 
 */
function save() {
    try {
        writeFileSync("./app/models/database-json/product.json", JSON.stringify(newDataProducts), "utf-8")
        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}