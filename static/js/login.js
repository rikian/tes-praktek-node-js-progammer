var email  = document.querySelector("#email_login")
var password = document.querySelector("#password_login")
var btnLogin = document.querySelector("#btn-login")
var xml = new XMLHttpRequest
var formLogin = document.querySelector("#login-form")

btnLogin.addEventListener("click", function(e) {
    e.preventDefault()
    // alert(window.location.origin)
    var dataLogin = "email_login="+email.value+"&password_login="+password.value
    xml.open("POST", window.location.origin + "/auth/login/", true)
    xml.setRequestHeader("content-type", "application/x-www-form-urlencoded")
    xml.send(dataLogin)
})

xml.onload = function() {
    try {
        alert(this.responseText)
        var message = JSON.parse(this.responseText)
        if (message && message["status"] === "ok") {
            return window.location.reload()
        }
    } catch (error) {
        // window.location.reload()
    }
}