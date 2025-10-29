import app from './app';
import http from "http";
import { env } from './config/env';
import { initWebSocket } from './ws.gateway';
import { startBinanceStream } from './modules/market/market.adapter';

const PORT = env.PORT || 5000;


const server = http.createServer(app);

initWebSocket(server);
const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];

symbols.forEach(symbol => startBinanceStream(symbol))


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
