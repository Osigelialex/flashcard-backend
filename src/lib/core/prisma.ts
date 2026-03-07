import "dotenv/config";

import { logger } from "./logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info("Connected to database");
  } catch (e) {
    logger.error(`Connection to database failed: ${e}`);
    process.exit(1);
  }
};

export { prisma, connectDatabase };
