const { Router } = require("express")
const router = Router()
const { handlerHome, handlerProducts, handlerImage, handlerProduct } = require("../controllers/controller")

router.get("/", (req, res) => handlerHome(req, res))

router.get("/products/", (req, res) => handlerProducts(req, res))

router.post("/products/save-data/", (req, res) => handlerProduct(req, res))

router.post("/products/save-image/", (req, res) => handlerImage(req, res))

router.post("/products/product/", (req, res) => handlerProduct(req, res))

router.delete("/products/product/", (req, res) => handlerProduct(req, res))

module.exports = { router }