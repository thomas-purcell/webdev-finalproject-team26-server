const logger = {
  info: (...args) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[36m%s', '[INFO]', ...args, '\x1b[0m');
  },
  warn: (...args) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[33m%s', '[WARN]', ...args, '\x1b[0m');
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[31m%s', '[ERROR]', ...args, '\x1b[0m');
  },
};

export default logger;
