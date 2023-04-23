import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config.js';
import logger from './logger.js';
import accountController from './services/accounts/accountController.js';
import mediaController from './services/media/mediaController.js';
import clubController from './services/clubs/clubController.js';

mongoose.connect(config.dbConnectionString);

const server = express();
server.use(express.json());
server.use(cors({
  origin: [
    'http://localhost:3000',
    'https://master--ornate-swan-b1069a.netlify.app',
  ],
  credentials: true,
}));
server.use(cookieParser());
server.set('trust proxy', 1);

accountController(server);
mediaController(server);
clubController(server);

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(config.port, () => {
  logger.info(`Server is listening on port ${config.port}`);
});
