import type { Request, Response } from "express";

import { handleErrors } from "../lib/error";
import { getUsers } from "../services/user";
import { getAllUsersSchema } from "../validators/user";

async function getAllUsers(request: Request, response: Response) {
  try {
    const {
      text,
      role,
      isVerified,
      isDeleted,
      page = 1,
      limit = 10,
    } = getAllUsersSchema.parse(request.query);

    const skip = (page - 1) * limit;
    const take = limit;

    const users = await getUsers({
      text,
      role,
      isVerified,
      isDeleted,
      skip,
      take,
    });

    response.success(
      {
        data: { users },
      },
      { message: "Users fetched successfully!" },
    );
  } catch (error) {
    handleErrors(response, error);

    return;
  }
}

export { getAllUsers };
