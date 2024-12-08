import type { Role } from "@prisma/client";

export type JSON =
  | number
  | string
  | boolean
  | undefined
  | null
  | Date
  | Error
  | JSONArray
  | JSONObject;

export interface JSONArray extends Array<JSON> {}

export interface JSONObject {
  [x: string]: JSON;
}

export interface Info {
  message: string;
}

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
    export interface Response {
      success: (body: JSONObject, info: Info) => void;
      created: (body: JSONObject, info: Info) => void;
      badRequest: (body: JSONObject, info: Info) => void;
      unauthorized: (body: JSONObject, info: Info) => void;
      forbidden: (body: JSONObject, info: Info) => void;
      notFound: (body: JSONObject, info: Info) => void;
      internalServerError: (body: JSONObject, info: Info) => void;
    }
  }
}
