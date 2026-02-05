import express from 'express';
import router from './modules/index.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
dotenv.config();
const app = express();
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
};

app.use(cors(corsOptions))

app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(YAML.load('swagger.yaml')))

app.use('/api', router);
app.use(errorMiddleware);
export default app;
