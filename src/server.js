import express from 'express';
import cors from 'cors';
import config from './config.js';
import logger from './logger.js';

const server = express();
server.use(cors());

server.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`);
});
