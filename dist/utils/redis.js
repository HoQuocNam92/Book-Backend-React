"use strict";
// import redis from "redis"
Object.defineProperty(exports, "__esModule", { value: true });
// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.PORT_REDIS}`
// })
// redisClient.on("error", (err) => {
//     console.error("Redis Client Error", err)
// })
// redisClient.connect()
//     .then(() => console.log("Connected to Redis"))
//     .catch((err) => console.error("Failed to connect to Redis", err))
// export default redisClient
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});
redisClient.connect()
    .then(() => console.log("Connected to Redis"))
    .catch((err) => console.error("Failed to connect to Redis", err));
exports.default = redisClient;
