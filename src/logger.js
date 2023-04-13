const logger = {
  info: (...args) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[36m%s', '[INFO]', '\x1b[0m', ...args);
  },
  warn: (...args) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[33m%s', '[WARN]', '\x1b[0m', ...args);
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[31m%s', '[ERROR]', '\x1b[0m', ...args);
  },
};

export default logger;
