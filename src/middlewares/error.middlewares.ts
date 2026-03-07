import { Request, Response, NextFunction } from "express";
import { HttpException } from "@lib/core/error";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Resource not found",
    data: null,
  });
};
