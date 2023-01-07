const express = require("express")
const Helper = require("../helper/helper")
const ProductRepository = require("../models/repository/product")
const UserRepository = require("../models/repository/user");
const formidable = require('formidable');
const { renameSync, rmSync } = require("fs");
const form = formidable({ 
    uploadDir : "./media/upload/",
    allowEmptyFiles : false,
    maxFiles : 1,
    maxFileSize : 202400,
});

module.exports = class ControllerProduct {
    /**
     * 
     * @param {ProductRepository} productRepository 
     * @param {UserRepository} userRepository
     * @param {Helper} helper 
     */
    constructor(userRepository, productRepository, helper) {
        this.userRepository = userRepository
        this.productRepository = productRepository
        this.helper = helper
    }

    /**
     * 
     * @returns {object []}
     */
    handlerGetProducts() {
        const products = this.productRepository.getProducts()
        return products
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    handlerGetProduct(req, res) {
        return res.status(200).json({status:"maintenance"})
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    handlerInsertProduct(req, res) {
        let contentType
            
        if (!req.headers["content-type"]) return res.status(400).end()

        if (req.headers["content-type"].match(";")) {
            contentType = req.headers["content-type"].trim().split(";")[0]
        } else {
            contentType = req.headers["content-type"]
        }

        if (contentType !== "multipart/form-data") {
            return res.status(400).end()
        }

        const user = req["user"]
        
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err.message)
                
                if (Object.values(files).length > 0) {
                    deleteImage(files.newFilename)
                }
                
                return res.status(500).json({
                    status : "failed",
                    message : "internal server error"
                })
            }

            if (Object.values(files).length === 0 || Object.values(fields).length === 0) {
                return res.status(400).end()
            }

            if (!fields.nama_barang || !fields.harga_beli || !fields.harga_jual || !fields.stok || !files.gambar_barang) {
                deleteImage(files.newFilename)
                return res.status(400).json({
                    status : "failed",
                    message : "bad request"
                })
            }

            // check image
            switch (files.gambar_barang.mimetype) {
                case "image/jpeg":
                    break
                case "image/jpg":
                    break
                case "image/png":
                    break
                default:
                    deleteImage(files.newFilename)
                    return res.status(400).json({
                        status : "failed",
                        message : "bad request"
                    })  
            }

            const ext = files.gambar_barang.mimetype.split("/")[1]

            renameSync(files.gambar_barang.filepath, `${files.gambar_barang.filepath}.${ext}`)

            const dataBarang = {
                "user_id" : user.user_id,
                "id_barang": `${Math.floor(Math.random() * 10000000)}${Math.floor(Math.random() * 10000000)}`,
                "nama_barang": fields.nama_barang,
                "harga_beli": this.helper.srtToInt(fields.harga_beli),
                "harga_jual": this.helper.srtToInt(fields.harga_jual),
                "stok": this.helper.srtToInt(fields.stok),
                "gambar_barang": `${files.gambar_barang.newFilename}.${ext}`
            }

            if (!dataBarang.harga_beli || !dataBarang.harga_jual || !dataBarang.stok) {
                deleteImage(files.newFilename)
                return res.status(400).json({
                    status : "failed",
                    message : "bad request"
                })
            }

            // save product to DB
            const statusInsertProductToDB = this.productRepository.insertProduct(dataBarang)

            if (!statusInsertProductToDB) {
                deleteImage(files.newFilename)
                return res.status(500).json({
                    status : "failed",
                    message : "internal server error"
                })
            }

            return res.status(200).json({
                status : "ok",
                message : "success"
            })

        });
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    handlerUpdateProduct(req, res) {
        const user = req["user"]
        // update product without change picture
        if (Object.values(req.body).length != 0) {
            const newDataProduct = req.body

            newDataProduct.harga_beli = this.helper.srtToInt(newDataProduct.harga_beli)
            newDataProduct.harga_jual = this.helper.srtToInt(newDataProduct.harga_jual)
            newDataProduct.stok = this.helper.srtToInt(newDataProduct.stok)

            if (!newDataProduct.user_id || !newDataProduct.id_barang || !newDataProduct.nama_barang ||!newDataProduct.harga_beli || !newDataProduct.harga_jual || !newDataProduct.stok || !newDataProduct.gambar_barang || newDataProduct.gambar_barang_baru) {
                return res.status(400).json({status:"bad request"})
            }

            if (newDataProduct.user_id !== user.user_id) {
                return res.status(401).json({status:"unauthorize"})
            }

            const saveUpdateProduct = this.productRepository.updateProduct(newDataProduct)

            if (!saveUpdateProduct) {
                return res.status(500).json({status:"failed update product"})
            }

            return res.status(200).json({status:"ok"})
        }

        if (!req.headers["content-type"]) return res.status(400).end()

        let contentType
                
        if (req.headers["content-type"].match(";")) {
            contentType = req.headers["content-type"].trim().split(";")[0]
        } else {
            contentType = req.headers["content-type"]
        }

        if (contentType !== "multipart/form-data") {
            return res.status(400).end()
        }

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err.message)
                deleteImage(files.newFilename)
                return res.status(500).json({
                    status : "failed",
                    message : "internal server error"
                })
            }

            if (Object.values(files).length === 0 || Object.values(fields).length === 0) {
                return res.status(400).end()
            }

            if (!fields.user_id || !fields.id_barang || !fields.nama_barang ||!fields.harga_beli || !fields.harga_jual || !fields.stok || !fields.gambar_barang || !files.gambar_barang_baru) {
                deleteImage(files.newFilename)
                return res.status(400).json({
                    status : "failed",
                    message : "bad request"
                })
            }

            fields.harga_beli = this.helper.srtToInt(fields.harga_beli)
            fields.harga_jual = this.helper.srtToInt(fields.harga_jual)
            fields.stok = this.helper.srtToInt(fields.stok)

            if (!fields.harga_beli || !fields.harga_jual || !fields.stok) {
                deleteImage(files.newFilename)
                return res.status(400).json({
                    status : "failed",
                    message : "bad request"
                })
            }

            // check image
            switch (files.gambar_barang_baru.mimetype) {
                case "image/jpeg":
                    break
                case "image/jpg":
                    break
                case "image/png":
                    break
                default:
                    deleteImage(files.newFilename)
                    return res.status(400).json({
                        status : "failed",
                        message : "bad request"
                    })  
            }
            
            const ext = files.gambar_barang_baru.mimetype.split("/")[1]

            renameSync(files.gambar_barang_baru.filepath, `${files.gambar_barang_baru.filepath}.${ext}`)
            deleteImage(fields.gambar_barang)
            
            fields.gambar_barang_baru = `${files.gambar_barang_baru.newFilename}.${ext}`

            const saveUpdateProduct = this.productRepository.updateProduct(fields)

            if (!saveUpdateProduct) {
                deleteImage(files.newFilename)
                return res.status(500).json({status:"failed update product"})
            }

            return res.status(200).json({
                status : "ok",
                message : "success"
            })
        });
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    handlerDeleteProduct(req, res) {
        if (Object.values(req.body).length == 0) {
            return res.status(401).end()
        }

        const dataProduct = req.body
        
        if (req.user.user_id !== dataProduct.user_id) {
            return res.status(401).json({
                status : "failed",
                message : "unauthorize"
            })
        }

        const statusDeleteProduct = this.productRepository.deleteProduct({
            user_id:dataProduct.user_id, id_barang:dataProduct.id_barang
        })

        // delete product from db
        if(!statusDeleteProduct) {
            return res.status(404).json({
                status : "failed",
                message : "not found"
            })
        }

        // delete image from media
        deleteImage(statusDeleteProduct.gambar_barang)

        return res.status(200).json({status:"success"})
    }
}

function deleteImage(filename) {
    try {
        rmSync(`./media/upload/${filename}`)
        
        return true
    } catch (error) {
        console.log(error.message)
        return false
    }
}