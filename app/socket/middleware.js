const key = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
const crypto = require("crypto");
const { parseToBuffer, parseMessage } = require("./socket-helper");
const users = require("../models/database-json/users.json")
const socket_users = {}

function handlerUpgrade(req, socket, head) {
    try {
        const cookie = req.headers.cookie.split("=")[1]
        const user = users.find(data => data["user_id"] === cookie)

        if (!user) return socket.end()

        const sha = crypto.createHash("sha1");
        const socket_key = req.headers["sec-websocket-key"];
        const socket_pair = socket_key + key
        const update_sha = sha.update(socket_pair, "binary").digest("base64")
    
        socket.write(
            "HTTP/1.1 101 Switching Protocols\r\n" +
            "Upgrade: websocket\r\n" +
            "Connection: Upgrade\r\n" +
            "Sec-WebSocket-Protocol: json\r\n" +
            "Sec-WebSocket-Accept:" +
            update_sha + "\r\n\r\n"
        )
    
        if (socket_users[cookie]) delete socket_users[cookie];
        socket_users[cookie] = socket

        socket_users[cookie].write(parseToBuffer(129, { 
            method: "connect",
            user : user
        }));
    
        const sendPing = setInterval(function _sendPing() {
            try {
                if (socket_users[cookie]) return socket_users[cookie].write(parseToBuffer(137, "ping"));
                return clearInterval(sendPing);
            } catch (error) {
                console.log(error);
                clearInterval(sendPing);
            }
        }, 30000);
    
        socket_users[cookie].on("data", (buffer) => {
            try {
                const message = parseMessage(buffer)
                console.log(message)
        
                if (message === "close") {
                    console.log(`${cookie} meninggalkan chat`)
                    socket.end()
                    delete socket_users[cookie];
                    return 
                }
    
                if (message === "pong") return
    
                if (message["method"] === "send chat") {
                    socket_users[cookie].write(parseToBuffer(129, {
                        method : "send chat",
                        message : {
                            chat : message["message"],
                            date : message["date"]
                        }
                    }))
        
                    return
                }
            } catch (error) {
                console.log(error.message)
            }
        })
    
        socket_users[cookie].on("error", (err) => {
            console.log(err)
        })
    } catch (error) {
        console.log(error.message)
        socket.end()
    }
}

module.exports = { handlerUpgrade }