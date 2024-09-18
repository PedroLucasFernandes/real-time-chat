const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const {
    uniqueNamesGenerator,
    colors,
    animals,
} = require ("unique-names-generator");

const app = express();
const port = 2020;
const host = "localhost";

app.use(express.static("./public"));
const server = http.createServer(app);

server.listen(port, () =>{
    console.log(`Server is running on http://${host}:${port}`);
});

const clients = new Set();
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});

wss.on("connection", (ws) => {
    ws.username = generateUniqueUsername();
    ws.color = generateRandomColor();

    broadcastMessage(ws, "joined", "entrou!");
    clients.add(ws);

    ws.on("message", (message) => {
        broadcastMessage(ws, "typed", message.toString());
    });

    ws.on("close", () => {
        clients.delete(ws);
        broadcastMessage(ws, "left", "saiu!");
    });
});    
        
function generateUniqueUsername() {        
    return uniqueNamesGenerator({ dictionaries: [colors, animals] });
}        

function generateRandomColor() {
    const letters = "0123456789ABCDEF";        
    let color = "#";
    for (let i=0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];     
    }
        
    return color;
        
}

function broadcastMessage(senderWs, type, content) {
    clients.forEach((client) => {

        const message = {
            owner: senderWs.username,
            color: senderWs.color,
            type: type,
            content: content,
        };
        client.send(JSON.stringify(message));
    });
}