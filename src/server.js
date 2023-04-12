import express from 'express';
import cors from 'cors';
import config from './config.js';
import logger from './logger.js';
import accountController from './services/accounts/accountController.js';

const server = express();
server.use(express.json());
server.use(cors());

accountController(server);

server.listen(config.port, () => {
  logger.info(`Server is listening on port ${config.port}`);
});
