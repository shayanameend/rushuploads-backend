import type { Request, Response } from "express";

import { BadResponse, handleErrors } from "../lib/error";
import { prisma } from "../lib/prisma";
import { deleteUserById, getUserById, getUsers } from "../services/user";
import {
  deleteOneUserSchema,
  getAllUsersSchema,
  getOneUserSchema,
} from "../validators/user";

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

async function getOneUser(request: Request, response: Response) {
  try {
    const { userId } = getOneUserSchema.parse(request.params);

    const user = await getUserById({ id: userId });

    if (!user) {
      throw new BadResponse("User not found!");
    }

    response.success(
      {
        data: { user },
      },
      { message: "User fetched successfully!" },
    );
  } catch (error) {
    handleErrors(response, error);

    return;
  }
}

async function deleteOneUser(request: Request, response: Response) {
  try {
    const { userId } = deleteOneUserSchema.parse(request.params);

    const user = await getUserById({ id: userId });

    if (!user) {
      throw new BadResponse("User not found!");
    }

    await deleteUserById({ id: userId });

    response.success({}, { message: "User deleted successfully!" });
  } catch (error) {
    handleErrors(response, error);

    return;
  }
}

export { getAllUsers, getOneUser, deleteOneUser };
