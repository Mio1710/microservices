import { Request, Response } from "express";
import { UserService } from "../services/user.service";

class UserController {
  constructor(private userService: UserService) {}
  getAllUsers = async (req: Request, res: Response) => {
    try {
      console.log("Fetching all users with query:", req.query.search);

      const users = await this.userService.getAllUsers(req.query);
      // console.log("Fetched users:", users);

      res.status(200).json({
        status: 200,
        message: "Users retrieved successfully!",
        data: users,
      });
    } catch (error: any) {
      console.log("Error fetching users:", error);
      res.status(error?.statusCode).json({
        status: error?.statusCode,
        message: error?.message,
      });
    }
  };
}

export const userController = new UserController(new UserService());
