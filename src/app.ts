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

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
  }

  private listen() {
    this.app.listen(appConfig.app.port, () => {
      logger.info(`Server started and running on port ${appConfig.app.port}`);
    });
  }

  public async startApp() {
    try {
      this.setupMiddlewares();
      this.setupRouting();
      this.setupErrorHandlers();
      await connectDatabase();
      this.listen();
    } catch (e) {
      logger.error(`Failed to start application: ${e}`);
      process.exit(1);
    }
  }

  private setupErrorHandlers() {
    this.app.use(errorHandler);
    this.app.use(notFoundHandler);
  }

  private setupMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRouting() {
    this.app.use("/v1", v1Router);
  }
}
