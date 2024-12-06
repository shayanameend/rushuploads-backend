import type { Role, User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import { verifyToken } from "../services/jwt";
import { getUserById } from "../services/user";

interface VerifyRequestParams {
  role?: Role;
  isVerified?: boolean;
}

function verifyRequest({ role, isVerified }: Readonly<VerifyRequestParams>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken) {
        res.status(401).json({
          message: "Unauthorized!",
        });

        return;
      }

      const token = bearerToken.split(" ")[1];

      const decodedUser = (await verifyToken(token)) as User;

      if (role && decodedUser.role !== role) {
        res.status(403).json({
          message: "Forbidden!",
        });

        return;
      }

      if (isVerified && !decodedUser.isVerified) {
        res.status(403).json({
          message: "User Not Verified!",
        });

        return;
      }

      const { user } = await getUserById({ id: decodedUser.id });

      if (!user) {
        throw new Error("User Not Found!");
      }

      user.password = undefined;

      req.user = user;

      next();
    } catch (error) {
      res.status(401).json({
        message: "Unauthorized!",
      });

      return;
    }
  };
}

export { verifyRequest };
