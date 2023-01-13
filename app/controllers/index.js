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
    async home(req, res) {
        const products = await this.productRepository.getProducts()

        if (req.authentication || req.user) {
            const user = req["user"]

            return res.render('../app/views/user', {products:products, user:user, userProducts:user.products})
        } else {
            return res.render('../app/views/visitor', {products})
        }
    }
}