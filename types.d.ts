import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}
