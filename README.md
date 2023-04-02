# NodeJS Server for CS4550
Node server for CS4550 final project Spring 2023

## Starting up
To run the server in production use `npm start`

To run the server in development use `npm run dev`

## Development
There is a very lightweight logger available:
```JavaScript
import logger from './logger.js';

logger.info('Example [INFO] message');
logger.warn('Example [WARN] message');
logger.error('Example [ERROR] message');
```

Environment variables can be added to the `.env` file. When adding new enviornment variables, also add them to `config.js`. The `config` can be accessed from any file:
```JavaScript
import logger from './logger.js';
import config from './config.js';

logger.info(`The configured port is: ${config.port}`);
```