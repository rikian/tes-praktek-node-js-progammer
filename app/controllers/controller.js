const { writeFileSync, existsSync, readFileSync, rmSync} = require("fs")
const { randomUUID } = require("crypto")
const dataProducts = require("../models/database-json/products.json")
const { host } = require("../config/confiq")

function handlerHome(req, res) {
    const products = JSON.parse(readFileSync("./app/models/database-json/products.json", "utf-8"))
    for (let i = 0; i < products.length; i++) {
        products[i]["nama_barang"] = decodeString(products[i]["nama_barang"])
    }

    res.render("index", {
        "host" : `${host}/static`,
        "products" : products
    })  
}

function handlerProducts(req, res) {
    const products = JSON.parse(readFileSync("./app/models/database-json/products.json", "utf-8"))
    for (let i = 0; i < products.length; i++) {
        products[i]["nama_barang"] = decodeString(products[i]["nama_barang"])
    }

    res.json({
        "method" : "get all products",
        "products": products,
        "code" : 200,
        "error" : null
    })
}

function handlerImage(req, res) {
    var buff = []
    req.on("data", (data) => {
        buff.push(data)
    })

    req.on("end", async () => {
        try {
            const dataImage = Buffer.concat(buff)
            buff = []
            if (dataImage.length.toString() === req.headers["content-length"] && dataImage.length < 100000 && (req.headers["content-type"] === "image/jpg" || req.headers["content-type"] === "image/png" || req.headers["content-type"] === "image/jpeg")) {
                const dataProduct = dataProducts.find((dataProduct) => dataProduct["token"] === req.headers["token"])                
                if (!dataProduct) return res.json({"message" : "data product not found"})
                dataProduct["gambar_barang"] = `${randomUUID()}.${req.headers["content-type"].split("/")[1]}`
                const locationFile = `./media/images/${dataProduct["gambar_barang"]}`
                const isExistlocationFile = existsSync(locationFile)
                
                if (isExistlocationFile) return res.json({"message" : "path already exist"})

                writeFileSync(locationFile, dataImage)
                dataProduct["token"] = ""
                writeFileSync("./app/models/database-json/products.json", JSON.stringify(dataProducts))
                
                return res.json({
                    "code" : 200,
                    "status" : "success",
                    "method" : "save image product",
                    "error" : null,
                    "product" : {
                        "id" : dataProduct["id"],
                        "nama_barang" : decodeString(dataProduct["nama_barang"]),
                        "harga_beli" : dataProduct["harga_beli"],
                        "harga_jual" : dataProduct["harga_jual"],
                        "stock" : dataProduct["stock"],
                        "gambar_barang" : dataProduct["gambar_barang"],
                    }
                })
            }

            return res.json({"message" : "failed save image"})
        } catch (error) {
            console.log(error.message)
            res.json({"message" : "pastikan semua data diisi dengan benar"})
        }
    })

    req.on("error", (e) => {
        res.json({"message" : "Sepertinya ada yang salah"})
        return
    })
}

function handlerProduct(req, res) {
    var buff = []
    req.on("data", (data) => {
        buff.push(data)
    })

    req.on("end", async () => {
        try {
            const dataProduct = JSON.parse(Buffer.concat(buff).toString())
            buff = []

            if (dataProduct["method"] === "hapus data barang") {
                const product = dataProducts.find(data => data["id"] === dataProduct["id"])
                if (!product) return res.json({"message" : "product tidak ditemukan"})
                const indexProduct = dataProducts.findIndex(data => data["id"] === dataProduct["id"])
                if (indexProduct === -1) return res.json({"message" : "product tidak ditemukan"})
                rmSync(`./media/images/${product["gambar_barang"]}`, {recursive: true, force: true})
                dataProducts.splice(indexProduct, 1)
                writeFileSync("./app/models/database-json/products.json", JSON.stringify(dataProducts))
                return res.json({
                    "method" : "hapus barang",
                    "message" : "success hapus barang",
                    "id" : dataProduct["id"]
                })
            }

            if (dataProduct["method"] === "ubah data barang") {
                dataProduct["nama_barang"] = encodeString(dataProduct["nama_barang"])
                dataProduct["harga_beli"] = checkNumber(dataProduct["harga_beli"])
                dataProduct["harga_jual"] = checkNumber(dataProduct["harga_jual"])
                dataProduct["stock"] = checkNumber(dataProduct["stock"])

                // validasi update data
                if (!dataProduct["id_barang"] || !dataProduct["nama_barang"] || !dataProduct["harga_beli"] || !dataProduct["harga_jual"] || !dataProduct["stock"] || !dataProduct["gambar_barang"]) {
                    return res.json({"message" : "pastikan semua data diisi dengan benar"})
                }

                let dataBarangLama = dataProducts.find(_dataProduct_ => _dataProduct_["nama_barang"] === dataProduct["nama_barang"])
                if (dataBarangLama) {
                    if (dataBarangLama["id"] === dataProduct["id_barang"] && dataBarangLama["gambar_barang"] === dataProduct["gambar_barang"]) {
                        dataBarangLama["nama_barang"] = dataProduct["nama_barang"]
                        dataBarangLama["harga_beli"] = dataProduct["harga_beli"]
                        dataBarangLama["harga_jual"] = dataProduct["harga_jual"]
                        dataBarangLama["stock"] = dataProduct["stock"]
    
                        writeFileSync("./app/models/database-json/products.json", JSON.stringify(dataProducts))
    
                        return res.json({
                            "method" : "success update data",
                            "message" : "success update data",
                            "product" : {
                                "id" : dataBarangLama["id"],
                                "nama_barang" : decodeString(dataBarangLama["nama_barang"]),
                                "harga_beli" : dataBarangLama["harga_beli"],
                                "harga_jual" : dataBarangLama["harga_jual"],
                                "stock" : dataBarangLama["stock"],
                                "gambar_barang" : dataBarangLama["gambar_barang"],
                            }
                        })
                    } 
                    
                    return res.json({"message" : "nama barang telah digunakan"})
                }

                dataBarangLama = dataProducts.find((_dataProduct_) => _dataProduct_["id"] === dataProduct["id_barang"] && _dataProduct_["gambar_barang"] === dataProduct["gambar_barang"])

                if (!dataBarangLama) return res.json({"message" : "nama barang telah digunakan"})
                
                dataBarangLama["nama_barang"] = dataProduct["nama_barang"]
                dataBarangLama["harga_beli"] = dataProduct["harga_beli"]
                dataBarangLama["harga_jual"] = dataProduct["harga_jual"]
                dataBarangLama["stock"] = dataProduct["stock"] 

                writeFileSync("./app/models/database-json/products.json", JSON.stringify(dataProducts))

                return res.json({
                    "method" : "success update data",
                    "message" : "success update data",
                    "product" : {
                        "id" : dataBarangLama["id"],
                        "nama_barang" : decodeString(dataBarangLama["nama_barang"]),
                        "harga_beli" : dataBarangLama["harga_beli"],
                        "harga_jual" : dataBarangLama["harga_jual"],
                        "stock" : dataBarangLama["stock"],
                        "gambar_barang" : dataBarangLama["gambar_barang"],
                    }
                })
            }

            if (dataProduct["method"] === "tambah data barang") {
                dataProduct["nama_barang"] = encodeString(dataProduct["nama_barang"])
    
                const validateNamaBarang = dataProducts.find((data) => data["nama_barang"] === dataProduct["nama_barang"])
                if (validateNamaBarang) return res.json({"message" : "nama barang telah dipakai"})
    
                dataProduct["id"] = `${Math.floor(Math.random() * 10000)}${Math.floor(Math.random() * 10000)}`
                dataProduct["harga_beli"] = checkNumber(dataProduct["harga_beli"])
                dataProduct["harga_jual"] = checkNumber(dataProduct["harga_jual"])
                dataProduct["stock"] = checkNumber(dataProduct["stock"])
    
                if (!dataProduct["nama_barang"] || !dataProduct["harga_beli"] || !dataProduct["harga_jual"] || !dataProduct["stock"] ) {
                    return res.json({"message" : "pastikan semua data diisi dengan benar"})
                }
    
                dataProduct["gambar_barang"] = ``
                dataProduct["token"] = `${Math.floor(Math.random() * 10000)}${Math.floor(Math.random() * 10000)}`
    
                dataProducts.push(dataProduct)
    
                writeFileSync("./app/models/database-json/products.json", JSON.stringify(dataProducts))
    
                res.json({
                    "code" : 200,
                    "method" : "post data product",
                    "token" : dataProduct["token"],
                    "error" : null,
                })
    
                return
            }

            return res.json({"message" : "Method not allowed"})
        } catch (error) {
            console.log(error.message)
            res.json({"message" : "pastikan semua data diisi dengan benar"})
        }
    })

    req.on("error", (e) => {
        res.end("not oke")
        return
    })
}

// helper
function checkNumber(input) {
    try {
        const result = parseInt(input)
        if (Number.isNaN(result)) {
            return false
        }

        return result
    } catch (error) {
        console.log(error.message)
        return false
    }
}

function encodeString(input) {
    try {
        if (typeof input !== "string") return false
        if (!input.match(" ")) return input
        const inputParts = input.split(" ")
        const encode = inputParts.reduce((a,b) => a + "%//%" + b)
        return encode
    } catch (error) {
        console.log("encode string error : " + error.message)
        return false
    }
}

function decodeString(input) {
    try {
        if (typeof input !== "string") return false
        if (!input.match("%//%")) return input
        const inputParts = input.split("%//%")
        const decode = inputParts.reduce((a,b) => a + " " + b)
        return decode
    } catch (error) {
        console.log("decode string error : " + error.message)
        return false
    }
}

module.exports = { handlerImage, handlerProduct, handlerHome, handlerProducts }