import winston from "winston";
import { appConfig } from "@config/index";

const transports: winston.transport[] = [
  new winston.transports.Console({
    handleExceptions: true,
    handleRejections: true,
    format: appConfig.app.isProduction
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
  }),
];

if (!appConfig.app.isProduction) {
  transports.push(
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  );
}

export const logger = winston.createLogger({
  level: appConfig.app.isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports,
  exitOnError: false,
});

process.on("SIGTERM", () => {
  logger.end();
});

process.on("SIGINT", () => {
  logger.end();
});
