import { WebSocket } from "ws";
import redis from "../../config/redis";

const BINANCE_WS_URL="wss://stream.binance.com:9443/ws";

export async function startBinanceStream(symbol: string) {
    const symbolName = `${symbol.toLowerCase()}@trade`;
    const ws = new WebSocket(`${BINANCE_WS_URL}/${symbolName}`);

    ws.on("open", () => console.log("Connected to Binance server"));

    ws.on("message", (data) => {
        const trade = JSON.parse(data.toString());
        const tick =  {
            symbol: trade.s,
            price: parseFloat(trade.p),
            volume: parseFloat(trade.q),
            timestamp: trade.T
        }
        
        
        redis.publish(`market:${trade.s}`, JSON.stringify(tick));

    });
    
    ws.on("close", () => {
        console.log(`Stream for ${symbol} has been closed.`)
    });

    ws.on("error", (err) =>{
        console.error(`Binance WS error ${err}`)
    } )
}