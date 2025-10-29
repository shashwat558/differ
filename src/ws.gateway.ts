import {WebSocketServer} from "ws";
import redis from "./config/redis";





export function initWebSocket(server: any) {
    
    const wss = new WebSocketServer({server});
      const subscriber = redis.duplicate();
    subscriber.connect();
    subscriber.subscribe("market:BTCUSDT", (msg) => {
        wss.clients.forEach((client) => {
            if(client.readyState === 1) {
                client.send(JSON.stringify({type: "market", tick: JSON.parse(msg)}));
            
            }
        })
    })

    wss.on("connection", (ws) => {
        console.log("Client connected");

        ws.send(JSON.stringify({type: "Welcome", message:"Connected to CFD backend"}));
        
        ws.on("message", (message) => {
            try {
                const data = JSON.parse(message.toString());
                console.log("Client says:", data);

                if(data.type === 'subscribe' && data.symbol) {
                    ws.send(JSON.stringify({type: "subscribed", symbol: data.symbol}));
                }
            } catch (error) {
                console.error("Invalid ws message", error);
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected")
        })
    });

  

    subscriber.subscribe("orders:new", (msg) => {
        wss.clients.forEach((client) => {
            if(client.readyState === 1) {
                client.send(JSON.stringify({type: "order", order: JSON.stringify(msg)}));
            }
        })
    })

    console.log("WebSocket gateway initialized");




}