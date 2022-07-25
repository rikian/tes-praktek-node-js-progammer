const ws = new WebSocket("ws://" + window.location.host, ["json"]);
var user = null
var cardBodyMessage = qs("#card-body-message")
var chatMessage = qs("#message-chat")
var chatReset = qs("#reset-chat")
var chatSend = qs("#send-chat")

var userProfile = qs("#user-profile")
var userImage = qs("#user-image")

console.log(userImage)

chatSend.addEventListener("click", function(e) {
    e.preventDefault()
    ws.send(JSON.stringify({
        method : "send chat",
        "message" : chatMessage.value,
        date : parseDate()
    }))

    chatReset.click()
})

ws.addEventListener("open", function(ev) {
    console.log("you are connected to web socket server ...")
})

ws.addEventListener("close", function() {
    console.log("connection close by server")
})

ws.addEventListener("message", function(ev) {
    var message = JSON.parse(ev.data)
    console.log(message)

    if (message["method"] === "connect") {
        user = message["user"]
        userProfile.innerText = user["user_name"]
        userImage.src = host +"/"+ user["user_image"]
        
        return
    }
    
    if (message["method"] === "send chat") {
        var chat = message["message"]
        var createBoxMessage = createBoxMessageLeft(chat)
        cardBodyMessage.appendChild(createBoxMessage)

        return
    }
})


function parseDate() {
    var date = new Date();
    var hour = date.getHours();
    var min = date.getMinutes();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month === 1) return `${day} Jan ${hour}.${min}`;
    if (month === 2) return `${day} Feb ${hour}.${min}`;
    if (month === 3) return `${day} Mar ${hour}.${min}`;
    if (month === 4) return `${day} Apr ${hour}.${min}`;
    if (month === 5) return `${day} Mei ${hour}.${min}`;
    if (month === 6) return `${day} Jun ${hour}.${min}`;
    if (month === 7) return `${day} Jul ${hour}.${min}`;
    if (month === 8) return `${day} Agus ${hour}.${min}`;
    if (month === 9) return `${day} Sept ${hour}.${min}`;
    if (month === 10) return `${day} Okt ${hour}.${min}`;
    if (month === 11) return `${day} Nov ${hour}.${min}`;
    if (month === 12) return `${day} Des ${hour}.${min}`;
}

function createBoxMessageLeft(userChat) {
    var dcm = ce("div")
    dcm.setAttribute("class", "direct-chat-msg")

    var dci = ce("div")
    dci.setAttribute("class", "direct-chat-infos clearfix")
    dcm.appendChild(dci)

    var sdci = ce("span")
    sdci.setAttribute("class", "direct-chat-name float-left")
    sdci.innerText = user["user_name"]
    dci.appendChild(sdci)

    var sdci2 = ce("span")
    sdci2.setAttribute("class", "direct-chat-timestamp float-right")
    sdci2.innerText = userChat["date"]
    dci.appendChild(sdci2)

    var imgUserChat = ce("img")
    imgUserChat.setAttribute("class", "direct-chat-img")
    imgUserChat.setAttribute("src", user["user_image"])
    dcm.appendChild(imgUserChat)

    var messageUserChat = ce("div")
    messageUserChat.setAttribute("class", "direct-chat-text")
    messageUserChat.innerText = userChat["chat"]
    dcm.appendChild(messageUserChat)

    return dcm
}