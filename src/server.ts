import app from './app';
import http from "http";
import { env } from './config/env';
import { initWebSocket } from './ws.gateway';

const PORT = env.PORT || 5000;


const server = http.createServer(app);

initWebSocket(server);


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
