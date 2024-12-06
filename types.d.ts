import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        role: Role;
        isVerified: boolean;
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}
