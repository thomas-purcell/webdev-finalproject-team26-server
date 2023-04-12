import logger from '../../logger.js';

const registrationHandler = (req, res) => {
  logger.info(req.body);
  res.sendStatus(200);
};

const loginHandler = (req, res) => {
  logger.info(req.body);
  res.json({ accountToken: 'test123' });
};

const logoutHandler = (req, res) => {
  logger.info(req.body);
  res.sendStatus(200);
};

const accountController = (server) => {
  server.post('/register', registrationHandler);
  server.post('/login', loginHandler);
  server.post('/logout', logoutHandler);
};

export default accountController;
