const socket = new WebSocket("ws://localhost:2020");
const sendButton = document.querySelector("#send-button");
const inputMessage = document.querySelector("#message");

sendButton.addEventListener("click", sendMessage);

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
});

function sendMessage() {
    const message = inputMessage.value.trim();
    if(message) {
        socket.send(message);
        inputMessage.value = "";
    }
}

socket.onmessage = (event) => {
    const { owner, content, type, color } = JSON.parse(event.data);
    displayMessage(owner, content, type, color);
}

function displayMessage(owner, content, type, color) {
    const messageContainerElem = document.createElement("div");
    messageContainerElem.innerHTML = `<span style="color: ${color}">${owner}</span> ${content}`;
    document.querySelector("#messages").appendChild(messageContainerElem);
}