import winston from 'winston';
import chalk from 'chalk';
import { config } from '../config.js';

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const coloredLevel = {
    error: chalk.red('ERROR'),
    warn: chalk.yellow('WARN'),
    info: chalk.blue('INFO'),
    debug: chalk.gray('DEBUG'),
  }[level] || level;

  return `${chalk.gray(timestamp)} ${coloredLevel} ${message}`;
});

export const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
  ],
});
