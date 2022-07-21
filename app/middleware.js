const { host } = require("./config/confiq")

function middleware(req, res, next) {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*")
        res.setHeader("Access-Control-Allow-Headers", "*")
        const cookies = req.cookies
        // hanya untuk mempersingkat. Seharusnya cek terlebih dahulu sebelum next
        if (cookies["login"]) return next()
        if (req.method === "POST" && req.url === "/") return login(req, res)
        return res.render("login", { "host" : `${host}/static` })
    } catch (error) {
        console.log(error.message)
        return res.render("login", { "host" : `${host}/static` })
    }
}

function login(req, res) {
    var buff = []
    req.on("data", (data) => {
        buff.push(data)
    })

    req.on("end", async () => {
        try {
            const dataLogin = JSON.parse(Buffer.concat(buff).toString())
            buff = []
            if (!dataLogin || !dataLogin["email"] || !dataLogin["password"] || dataLogin["email"] !== "rikian" || dataLogin["password"] !== "54ng4t_R@h451A....") {
                return res.render("login", { "host" : `${host}/static` })
            }
            res.setHeader("set-cookie", `login=12345;`);
            res.json({"message" : "ok"})
            return
        } catch (error) {
            console.log(error.message)
            return res.render("login", { "host" : `${host}/static` })
        }
    })

    req.on("error", (e) => {
        console.log(e.message)
        return res.render("login", { "host" : `${host}/static` })
    })
}

module.exports = { middleware }
