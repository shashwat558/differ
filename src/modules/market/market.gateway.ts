import { WebSocketServer } from "ws";
import redis from "../../config/redis";

function initWebSocketServer(server: any){
    const wss = new WebSocketServer({server});
    const clientSubscription = new Map<any, Set<String>>();
    const subscriber = redis.duplicate() as any;
    const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];

    subscriber.connect();
    

    wss.on("connection", (ws) => {
        console.log("Market gateway connected");
        clientSubscription.set(ws, new Set);

        ws.on("message", (ms) => {
            const data = JSON.parse(ms.toString());
  
            if(data.type === "subscribe" && data.symbol){
                clientSubscription.get(ws)?.add(data.symbol);
                ws.send(JSON.stringify({type: "subscribed", symbol: data.symbol}));
                console.log(`Client subscribed to ${data.symbol}`)
            };


        });

        ws.on("close", () => {
            clientSubscription.delete(ws)
            console.log("Websocket connections ended")
        })
    })

    symbols.forEach(symbol => {
        subscriber.subscribe(`market:${symbol}`, (message:any) => {
            const tick = JSON.parse(message);

            for(const [client, subscribedSymbols] of clientSubscription.entries()){
                if(subscribedSymbols.has(symbol) && client.readyState == 1){
                    client.send(JSON.stringify({type: "market", tick}))
                }

            }
            
        })
    })

    
}