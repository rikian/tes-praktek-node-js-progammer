const express = require("express")
const ProductRepository = require("../models/repository/product")

module.exports = class ControllerResponse {
    /**
     * 
     * @param {ProductRepository} productRepository
     */
    constructor(productRepository) {
        this.productRepository = productRepository
    }

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @returns {express.Response}
     */
    home(req, res) {
        const products = this.productRepository.getProducts()

        if (req.authentication || req.user) {
            const user = req["user"]
            const userProducts = this.productRepository.getProductsById(user["user_id"])

            return res.render('user', {products:products, user:user, userProducts:userProducts})
        } else {
            return res.render('visitor', {products})
        }
    }
}