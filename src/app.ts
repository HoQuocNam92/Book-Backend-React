import express from 'express';
import router from './modules/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { errorMiddleware } from './middlewares/errorMiddleware.js';
dotenv.config();
const app = express();
const corsOptions = {
    origin: 'http://localhost:5173',
    credential: true
};

app.use(cors(corsOptions))

app.use(express.json());
app.use(cookieParser());

app.use('/api', router);
app.use(errorMiddleware);
export default app;
