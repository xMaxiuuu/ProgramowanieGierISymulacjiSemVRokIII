import { WebSocketServer } from "ws";

console.log("Start")

const aWebSocketServer = new WebSocketServer({ port: 8080 });

let aWabSocketPlayer;

aWebSocketServer.on("connection", (aWebSocketClient, req) => {
    const ip = req.socket.remoteAddress;
    console.log('Connected from IP: ${ip}')

    if(!aWabSocketPlayer){
        console.log("Player connected")
        aWabSocketPlayer = aWebSocketClient

        aWabSocketPlayer.on("close", () =>{
            aWabSocketPlayer = null
        })
        aWebSocketClient.on('error', console.error)

        aWabSocketPlayer.on("message", (data) => {
            aWebSocketServer.clients.forEach((client) =>{
                if(client !== aWabSocketPlayer && WebSocket.OPEN === client.readyState){
                    client.send(data)
                }
            })
        })

        const akvData = {
            id: 1
        };

        aWebSocketClient.send(JSON.stringify(akvData))
    }
})

console.log("Done")