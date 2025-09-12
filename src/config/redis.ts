import {createClient} from "redis";
import { env } from "./env";


const redis = createClient({ url: env.REDIS_URL });

redis.on("error", (err) => {
    console.error("Redis client error", err);
});

redis.connect().then(() => {
    console.log("Connected to Redis")
})


export default redis;
