import { User } from "../../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      validated?: {
        query?: any;
        params?: any;
      };
      user: User;
    }
  }
}

export {};
