import { Request, Response } from "express";
import AuthService from "./auth.service";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
  static register = async (req: Request, res: Response) => {
    await AuthService.register(req.body);
    return res.status(StatusCodes.CREATED).json({
      status: true,
      message: "User registered successfully",
      data: null,
    });
  };

  static login = async (req: Request, res: Response) => {
    const token = await AuthService.login(req.body);
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "User logged in successfully",
      data: token,
    });
  };

  static me = async (req: Request, res: Response) => {
    const result = await AuthService.me(req.user.id);
    return res.status(StatusCodes.OK).json({
      status: true,
      message: "User retrieved successfully",
      data: result,
    });
  };
}
