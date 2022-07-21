var email  = document.querySelector("#email_login")
var password = document.querySelector("#password_login")
var btnLogin = document.querySelector("#btn-login")

var xml = new XMLHttpRequest

btnLogin.addEventListener("click", function() {
    xml.open("POST", window.location.origin, true)
    xml.setRequestHeader("content-type", "application/json")
    xml.setRequestHeader("token", "12345")
    xml.send(JSON.stringify({
        email : email.value,
        password : password.value
    }))
})

xml.onload = function() {
    try {
        var message = JSON.parse(this.responseText)
        if (message && message["message"] === "ok") return window.location.reload()
    } catch (error) {
        window.location.reload()
    }
}