import { LoginDTO, RegisterDTO } from "./auth.dto";
import { prisma } from "@lib/core/prisma";
import { HttpException } from "@lib/core/error";
import { StatusCodes } from "http-status-codes";
import argon2 from "argon2";
import { signToken } from "@lib/core/helpers";
import { appConstants } from "@config/constants";

export default class AuthService {
  static async register(dto: RegisterDTO) {
    const user = await prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "Email already in use");
    }

    const { password, ...userData } = dto;
    const passwordHash = await argon2.hash(password);
    await prisma.user.create({
      data: {
        ...userData,
        password: passwordHash,
      },
    });
  }

  static async login(dto: LoginDTO) {
    const { email, password } = dto;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Invalid email or password",
      );
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Invalid email or password",
      );
    }

    const token = await signToken({
      userId: user.id,
      exp: appConstants.ACCESS_TOKEN_EXPIRY,
    });

    return {
      accessToken: token,
      user,
    };
  }

  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }

    return user;
  }
}
