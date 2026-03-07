import "reflect-metadata";
import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDatabase } from "@lib/core/prisma";
import { logger } from "@lib/core/logger";
import { appConfig } from "@config/index";
import { errorHandler, notFoundHandler } from "@middlewares/error.middlewares";
import v1Router from "@modules/v1/index";

const app: Application = express();

const setupMiddlewares = () => {
  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

const setupRouting = () => {
  app.use("/v1", v1Router);
};

const setupErrorHandlers = () => {
  app.use(errorHandler);
  app.use(notFoundHandler);
};

export const startApp = async () => {
  try {
    setupMiddlewares();
    setupRouting();
    setupErrorHandlers();
    await connectDatabase();

    app.listen(appConfig.app.port, () => {
      logger.info(`Server started and running on port ${appConfig.app.port}`);
    });
  } catch (e) {
    logger.error(`Failed to start application: ${e}`);
    process.exit(1);
  }
};

export default app;
