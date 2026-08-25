import { createClient } from "redis";
import "dotenv/config";


const redis = createClient({
  url: process.env.REDIS_URL,
  RESP: 2
});


redis.on("error", (error) => {
  console.log("Redis Error:  " + error);
});


await redis.connect();


export default redis;