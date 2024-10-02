import dayjs from 'dayjs';
import logger from 'pino';

// Create a logger with pretty print
const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true, // Colorize the log output
      translateTime: 'SYS:standard', // Use system time for better readability
      ignore: 'pid,hostname', // Ignore PID and hostname for cleaner output
      // You can also add other options like custom message format
    },
  },
  base: {
    pid: false, // Hide PID from log
  },
  timestamp: () => `,"time":"${dayjs().format()}"`, // Custom timestamp
});

// Example log usage
log.info('Logger initialized successfully');
log.error('This is an error message');

export default log;
