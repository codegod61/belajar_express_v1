import pino from "pino";

const LOG_LEVEL = {
    development: 'debug',
    test: 'silent',
    production: 'info'
}

export const logger = pino({
  level: LOG_LEVEL[process.env.NODE_ENV],
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: { colorize: true }
      }
    : undefined
});