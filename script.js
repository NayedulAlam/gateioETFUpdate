let infoTitle = "";
let infoDesc = "";
let title = document.querySelector("#title");
let desc = document.querySelector("#desc");
let date = document.querySelector("#date");
let loader = document.querySelector(".spinner");
let ws;

function connectWebSocket() {
    loader.style.opacity = 1;
    // Establish a WebSocket connection
    ws = new WebSocket("wss://api.gateio.ws/ws/v4/ann");
    // Handle connection opening
    ws.onopen = function () {
        console.log("Connected to WebSocket API");
        // Send a subscription message once connected
        ws.send(JSON.stringify({
            time: Math.floor(Date.now() / 1000), // Get current Unix timestamp in seconds
            channel: "announcement.summary_etf",
            event: "subscribe",
            payload: ["en"]
        }));
    };

    // Handle incoming messages
    ws.onmessage = function (event) {

        infoTitle = JSON.parse(event.data).result.title;
        infoDesc = JSON.parse(event.data).result.brief;

        setTimeout(() => {
            let strtInd = infoDesc.indexOf("The crypto leveraged ETF markets are traded 24/7");
            let endInd = infoDesc.indexOf("About Leveraged ETF");
            let dateInd = infoDesc.indexOf("Gate.io Team");
            loader.style.opacity = 0;

            title.innerText = infoTitle;
            desc.innerText = infoDesc.slice(strtInd, endInd);
            date.innerText = infoDesc.slice(dateInd);
        }, 1000);
    };

    // Handle errors
    ws.onerror = function (error) {
        loader.style.opacity = 1;

        console.error("WebSocket Error:", error);

    };

    // Handle connection closure
    ws.onclose = function () {
        console.log("WebSocket connection closed, attempting to reconnect...");
        setTimeout(connectWebSocket, 3600000); // Reconnect after 5 seconds
    };
}

connectWebSocket();
