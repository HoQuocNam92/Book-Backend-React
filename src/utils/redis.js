import redis from "redis";
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.PORT_REDIS}`
});
redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});
redisClient.connect()
    .then(() => console.log("Connected to Redis"))
    .catch((err) => console.error("Failed to connect to Redis", err));
export default redisClient;
