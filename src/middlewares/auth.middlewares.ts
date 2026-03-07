import { HttpException } from "@lib/core/error";
import { validateToken } from "@lib/core/helpers";
import { prisma } from "@lib/core/prisma";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid auth token");
  }

  const decodedPayload = validateToken(token) as any;
  if (!decodedPayload) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid auth token");
  }

  const user = await prisma.user.findUnique({
    where: { id: decodedPayload.userId },
  });
  if (!user) {
    throw new HttpException(StatusCodes.UNAUTHORIZED, "Invalid auth token");
  }

  req.user = user;
  next();
};
