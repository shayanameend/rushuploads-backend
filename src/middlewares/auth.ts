import type { Role, User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

import {
  BadResponse,
  ForbiddenResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  handleErrors,
} from "../lib/error";
import { getUserById } from "../services/user";
import { verifyToken } from "../utils/jwt";

interface VerifyRequestParams {
  role?: Role;
  isVerified?: boolean;
}

function verifyRequest({ role, isVerified }: Readonly<VerifyRequestParams>) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const bearerToken = request.headers.authorization;

      if (!bearerToken) {
        throw new UnauthorizedResponse("Unauthorized!");
      }

      const token = bearerToken.split(" ")[1];

      const decodedUser = (await verifyToken(token)) as User;

      if (role && decodedUser.role !== role) {
        throw new ForbiddenResponse("Forbidden!");
      }

      if (isVerified && !decodedUser.isVerified) {
        throw new BadResponse("User Not Verified!");
      }

      const { user } = await getUserById({ id: decodedUser.id });

      if (!user) {
        throw new NotFoundResponse("User Not Found!");
      }

      user.password = undefined;

      request.user = user;

      next();
    } catch (error) {
      handleErrors({ response, error });

      return;
    }
  };
}

export { verifyRequest };
