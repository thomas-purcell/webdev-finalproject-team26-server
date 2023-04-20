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
  origin: [
    'http://localhost:3000',
    'https://deploy-preview-5--ornate-swan-b1069a.netlify.app',
    'https://master--ornate-swan-b1069a.netlify.app/',
  ],
  credentials: true,
}));
server.use(cookieParser());
server.set('trust proxy', 1);

accountController(server);

server.listen(config.port, () => {
  logger.info(`Server is listening on port ${config.port}`);
});
