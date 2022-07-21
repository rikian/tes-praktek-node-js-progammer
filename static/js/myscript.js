"use strict"
var host  = window.location.origin

function qs(elm) {
    return document.querySelector(elm)
}

function ce(elm) {
    return document.createElement(elm)
}

var dataProducts = null
var imagePreview = new FileReader
var imageUpload = new FileReader
var xml = new XMLHttpRequest
var conImgPreview = qs("#con-img-preview")
var imgFile = qs("#gambar-barang")
var btnAddSubmit = qs("#btn-add-submit")
var btnAddReset = qs("#btn-add-reset")
var btnAddClose = qs("#btn-add-close")

// get products
var bodyProducts = qs("#body-products")
xml.open("GET", host + "/products/", true);
xml.send();

// handler tambah product
var namaBarang = qs("#nama-barang")
var hargaBeli = qs("#harga-beli")
var hargaJual = qs("#harga-jual")
var stock = qs("#stock-barang")

imgFile.addEventListener("change", function () {
    var prev = this.files[0]
    var type = prev["type"]
    var size = prev["size"]

    if (prev && type && size && (type === "image/jpeg" || type === "image/jpg" || type === "image/png") && size <= 100000) return imagePreview.readAsDataURL(prev);

    btnAddReset.click()
    return alert(`data tidak sesuai. \ntype : ${type}\nsize : ${size/1000}kb\n\nPastikan file yang dikirim berjenis .jpeg, .jpg, atau .png\nDan ukuran file tidak melebihi 100kb`);
})

btnAddReset.addEventListener("click", function() {
    if (conImgPreview.children.length == 1) {
        conImgPreview.innerHTML = ""
    }
    
    var newPreviewImage = ce("img")
    newPreviewImage.setAttribute("src", "")
    newPreviewImage.setAttribute("alt", "")
    newPreviewImage.setAttribute("id", "img-preview")
    newPreviewImage.style.maxWidth = "50%"
    conImgPreview.appendChild(newPreviewImage)
})

imagePreview.onload = function() {
    var imgPreview = qs("#img-preview")
    imgPreview.src = this.result;
    return;
}

btnAddSubmit.addEventListener("click", function() {
    try {
        if (!namaBarang.value || !hargaBeli.value || !hargaJual.value || !stock.value) return alert("pastikan semua data diisi dengan benar")
        var dataProduct = JSON.stringify({
            "method" : "tambah data barang",
            "nama_barang" : namaBarang.value,
            "harga_beli" : hargaBeli.value,
            "harga_jual" : hargaJual.value,
            "stock" : stock.value
        })

        xml.open("POST", host + "/products/save-data/", true);
        xml.setRequestHeader("content-type", imgFile.files[0].type);
        xml.setRequestHeader("token", "12345");
        xml.send(dataProduct);
    } catch (error) {
        return alert("pastikan semua data diisi dengan benar")
    }
})

xml.onload = function() {
    try {
        var message = JSON.parse(this.responseText)
        if (message && message["code"] === 200 && message["method"] === "post data product" && message["token"]) {
            imageUpload.readAsArrayBuffer(imgFile.files[0])
            imageUpload.onload = function() {
                xml.open("POST", host + "/products/save-image/", true);
                xml.setRequestHeader("content-type", imgFile.files[0].type);
                xml.setRequestHeader("token", message["token"]);
                xml.send(this.result);
                return
            }
            return
        }

        if (message && message["code"] === 200 && message["method"] === "save image product" && message["product"]) {
            var product = message["product"]
            if (dataProducts !== null) {
                dataProducts.push(product)
                var rowProductAdd = createRowProduct(product["id"])
                console.log(rowProduct)
                bodyProducts.appendChild(rowProductAdd)
                alert("Tambah data barang berhasil")
                btnAddReset.click()
                imagePreview.src = ""
                dataProduct.style.display = "block"
                addProduct.style.display = "none"
                window.location = host + `/#product-${product["id"]}`
                return 
            }

            return window.location.reload() 
        }

        if (message && message["code"] === 200 && message["method"] === "get all products") {
            if (!bodyProducts) return
            dataProducts = message["products"]

            for (let i = 0; i < dataProducts.length; i++) {
                var rowProduct = createRowProduct(dataProducts[i]["id"])
                bodyProducts.appendChild(rowProduct)
            }
            return
        }

        if (message && message["method"] === "success update data") {
            alert("success update data")
            dataProduct.style.display = "block"
            _updateProduct.style.display = "none"
            _btnUpdateReset.click()
            var product = message["product"]
            for (var i = 0; i < dataProducts.length; i++) {
                if (dataProducts[i]["id"] === product["id"]) {
                    dataProducts[i]["nama_barang"] = product["nama_barang"]
                    dataProducts[i]["harga_beli"] = product["harga_beli"]
                    dataProducts[i]["harga_jual"] = product["harga_jual"]
                    dataProducts[i]["stock"] = product["stock"]
                    break
                }
            }
            var dbNamaBarang = qs(`#nb-${product["id"]}`)
            var dbHargaBeli = qs(`#hb-${product["id"]}`)
            var dbHargaJual = qs(`#hj-${product["id"]}`)
            var dbStock = qs(`#s-${product["id"]}`)
            if (!dbNamaBarang || !dbHargaBeli || !dbHargaJual || !dbStock) return window.location.reload()
            dbNamaBarang.innerText = product["nama_barang"]
            dbHargaBeli.innerText = product["harga_beli"]
            dbHargaJual.innerText = product["harga_jual"]
            dbStock.innerText = product["stock"]
            dbNamaBarang.style.backgroundColor = "red"
            var borderTime = setTimeout(function(){
                dbNamaBarang.style.backgroundColor = ""
                return clearTimeout(borderTime)
            }, 4000)
            window.location = host + `/#product-${product["id"]}`
            return
        }

        if (message && message["method"] === "hapus barang") {
            alert(message["message"])
            var dbProduct = qs(`#product-${message["id"]}`)
            for (var i = 0; i < dataProducts.length; i++) {
                if (dataProducts[i]["id"] === message["id"]) {
                    delete dataProducts[i]
                    break
                }
            }
            return dbProduct.remove()
        }

        alert(message["message"])
    } catch (error) {
        console.log(error)
        alert("woppsss sorry, somthing wrong!!")
        window.location.reload()
    }
}

var dataProduct1 = qs("#data-product1")
var dataProduct = qs("#data-product")
dataProduct.style.display = "block"
var addProduct1 = qs("#add-product1")
var addProduct = qs("#add-product")
addProduct.style.display = "none"

addProduct1.addEventListener("click", function() {
    if (addProduct.style.display === "none") {
        dataProduct.style.display = "none"
        addProduct.style.display = "block"
        return
    }

    dataProduct.style.display = "block"
    addProduct.style.display = "none"
    return
})

btnAddClose.addEventListener("click", function() {
    dataProduct.style.display = "block"
    addProduct.style.display = "none"
})

function createRowProduct(id) {
    try {
        var product = null
        for (var i = 0; i < dataProducts.length; i++) {
            if (dataProducts[i]["id"] === id) {
                product = dataProducts[i]
                break
            }
        }
        var trProduct = ce("tr")
        trProduct.setAttribute("id", `product-${product["id"]}`)
        var tdImage = ce("td")
        var imageProduct = ce("img")
        imageProduct.setAttribute("src", host + `/media/images/${product["gambar_barang"]}`)
        imageProduct.setAttribute("alt", `assets`)
        imageProduct.setAttribute("loading", "lazy")
        imageProduct.style.width = "40px"
        imageProduct.style.heiht = "40px"
        tdImage.appendChild(imageProduct)
        trProduct.appendChild(tdImage)
    
        var tdNamaBarang = ce("td")
        tdNamaBarang.setAttribute("id", `nb-${product["id"]}`)
        tdNamaBarang.innerText = product["nama_barang"]
        trProduct.appendChild(tdNamaBarang)
    
        var tdHargaBeli = ce("td")
        tdHargaBeli.setAttribute("id", `hb-${product["id"]}`)
        tdHargaBeli.innerText = product["harga_beli"]
        trProduct.appendChild(tdHargaBeli)
    
        var tdHargaJual = ce("td")
        tdHargaJual.setAttribute("id", `hj-${product["id"]}`)
        tdHargaJual.innerText = product["harga_jual"]
        trProduct.appendChild(tdHargaJual)
    
        var tdStock = ce("td")
        tdStock.setAttribute("id", `s-${product["id"]}`)
        tdStock.innerText = product["stock"]
        trProduct.appendChild(tdStock)
    
        var tdActions = ce("td")
    
        var buttonViewAction = ce("button")
        buttonViewAction.innerText = "View"
        buttonViewAction.addEventListener("click", function() {
            return viewProduct(id)
        })
        tdActions.appendChild(buttonViewAction)
        
        var buttonUpdateAction = ce("button")
        buttonUpdateAction.innerText = "Update"
        buttonUpdateAction.addEventListener("click", function() {
            return updateProduct(id)
        })
        tdActions.appendChild(buttonUpdateAction)

        var buttonDeleteAction = ce("button")
        buttonDeleteAction.innerText = "Delete"
        tdActions.appendChild(buttonDeleteAction)
        buttonDeleteAction.addEventListener("click", function() {
            return deleteProduct(id)
        })

        trProduct.appendChild(tdActions)
    
        return trProduct
    } catch (error) {
        return false
    }
}

// handler view product
var _viewProduct = qs("#view-product")
_viewProduct.style.display = "none"
var _viewImage = qs("#v-image")
var _viewNamaBarang = qs("#v-nama-barang")
var _viewHargaJual = qs("#v-harga-jual")
var _viewHargaBeli = qs("#v-harga-beli")
var _viewStock = qs("#v-stock")
var _viewBtnClose = qs("#v-btn-close")

function viewProduct(id) {
    var product = null
    for (var i = 0; i < dataProducts.length; i++) {
        if (dataProducts[i]["id"] === id) {
            product = dataProducts[i]
            break
        }
    }
    dataProduct.style.display = "none"
    _viewImage.src = host + `/media/images/${product["gambar_barang"]}`
    _viewNamaBarang.innerText = `Nama Barang : ${product["nama_barang"]}`
    _viewHargaJual.innerText = `Harga Jual : ${product["harga_jual"]}`
    _viewHargaBeli.innerText = `Harga Beli : ${product["harga_beli"]}`
    _viewStock.innerText = `Stock : ${product["stock"]}`
    _viewProduct.style.display = "block"
}

_viewBtnClose.addEventListener("click", function() {
    dataProduct.style.display = "block"
    _viewProduct.style.display = "none"
})

// handler update product
var _updateProduct = qs("#update-product")
_updateProduct.style.display = "none"
var _updatePreviewImage = qs("#up-img-preview")
var _updateIdBarang = qs("#up-id-barang")
var _updateNamaBarang = qs("#up-nama-barang")
var _updateHargaJual = qs("#up-harga-jual")
var _updateHargaBeli = qs("#up-harga-beli")
var _updateStock = qs("#up-stock-barang")
var _updateGambarBarang = qs("#up-gambar-barang")
var _btnUpdateClose = qs("#btn-update-close")
var _btnUpdateReset = qs("#btn-update-reset")
var _btnUpdateSubmit = qs("#btn-update-submit")

function updateProduct(id) {
    var product = null
    for (var i = 0; i < dataProducts.length; i++) {
        if (dataProducts[i]["id"] === id) {
            product = dataProducts[i]
            break
        }
    }
    dataProduct.style.display = "none"
    _updatePreviewImage.src = host + `/media/images/${product["gambar_barang"]}`
    _updateIdBarang.innerText = product["id"]
    _updateNamaBarang.value = product["nama_barang"]
    _updateHargaBeli.value = product["harga_beli"]
    _updateHargaJual.value = product["harga_jual"]
    _updateGambarBarang.innerText = product["gambar_barang"]
    _updateStock.value = product["stock"]
    _updateProduct.style.display = "block"
    // console.log(product)
}

_btnUpdateClose.addEventListener("click", function() {
    dataProduct.style.display = "block"
    _updateProduct.style.display = "none"
    _btnUpdateReset.click()
})

_btnUpdateSubmit.addEventListener("click", function() {
    var newDataProduct = JSON.stringify({
        "method" : "ubah data barang",
        "id_barang" : _updateIdBarang.innerText,
        "nama_barang" : _updateNamaBarang.value,
        "harga_beli" : _updateHargaBeli.value,
        "harga_jual" : _updateHargaJual.value,
        "stock" : _updateStock.value,
        "gambar_barang" : _updateGambarBarang.innerText,
    })

    xml.open("POST", host + "/products/product/", true)
    xml.setRequestHeader("content-type", "application/json")
    xml.setRequestHeader("token", "12345")
    xml.send(newDataProduct)
})

// handler delete product
function deleteProduct(id) {
    try {
        var confirm = prompt("Perhatian! Data yang dihapus tidak dapat dikembalikan!\n\nketik 'yes' untuk melanjutkan")
        if (confirm !== "yes") return
        var dataProduct = JSON.stringify({
            "method" : "hapus data barang",
            "id" : id
        })
        xml.open("DELETE", host + "/products/product/", true)
        xml.setRequestHeader("content-type", "application/json")
        xml.setRequestHeader("token", "12345")
        xml.send(dataProduct)
    } catch (error) {
        console.log(error)
        alert("failed delete product")
    }
}

// handler paginations
var dbMain = qs("#db-main")
var dbPaginations = qs("#db-paginations")
dbPaginations.style.display = "none"
var bodyPagination = qs("#body-pagination")

var allData = qs("#all-pagination")
allData.addEventListener("click", function() {
    dbMain.style.display = "block"
    dbPaginations.style.display = "none"
    dbSearch.style.display = "none"
})

var paginations = document.querySelectorAll("#pagination-b")
paginations.forEach(function(pagination){
    pagination.addEventListener("click", function() {
        dbPaginations.style.display = "block"
        dbMain.style.display = "none"    
        dbSearch.style.display = "none"    
        bodyPagination.innerHTML = ""
        var q = pagination.innerText
        for (let i = 0; i < dataProducts.length; i++) {
            if (dataProducts[i]["nama_barang"].charAt(0) === q) {
               var rowBarang = createRowProduct(dataProducts[i]["id"])
               bodyPagination.appendChild(rowBarang)
            }
        }
    })
})

// handler search barang
var searchBr = qs("#search-barang")
var dbSearch = qs("#db-search")
dbSearch.style.display = "none"
var dbSearchBody = qs("#db-search-body")
searchBr.addEventListener("keyup", function() {
    dbSearch.style.display = "block"
    dbMain.style.display = "none"
    dbPaginations.style.display = "none"
    dbSearchBody.innerHTML = ""
    for (let i = 0; i < dataProducts.length; i++) {
        if (dataProducts[i]["nama_barang"].match(searchBr.value)) {
           var barangSeacrh = createRowProduct(dataProducts[i]["id"])
           dbSearchBody.appendChild(barangSeacrh)
        }
    }

    if (searchBr.value === ""){
        dbMain.style.display = "block"
        dbPaginations.style.display = "none"
        dbSearch.style.display = "none"
    }
})