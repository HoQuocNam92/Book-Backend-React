import { Queue } from 'bullmq';
import IOredis from 'ioredis';


const connection = new IOredis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

const orderQueue = new Queue('orderQueue', { connection });

export default orderQueue;
