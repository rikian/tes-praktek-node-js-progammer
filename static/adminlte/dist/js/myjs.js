var searchUser = document.querySelector("#search-user")
var btnSearchUser = document.querySelector("#btn-search-user")
var xml = new XMLHttpRequest()

btnSearchUser.addEventListener("click", function(e) {
    xml.open("GET", `http://localhost:9091/search-user?name=${searchUser.value}`, true)
    xml.send();
})

xml.onload = function(e) {
    console.log(e.target.response)
}