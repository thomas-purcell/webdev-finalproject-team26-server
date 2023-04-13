import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';
import accountController from './services/accounts/accountController.js';

mongoose.connect(config.dbConnectionString);

const server = express();
server.use(express.json());
server.use(cors({
  origin: ['http://localhost:3000', 'https://deploy-preview-2--ornate-swan-b1069a.netlify.app'],
  credentials: true,
}));
server.use(cookieParser());

accountController(server);

server.listen(config.port, () => {
  logger.info(`Server is listening on port ${config.port}`);
});
