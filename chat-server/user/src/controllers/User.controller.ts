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

  uploadFile = async (req: Request, res: Response) => {
    try {
      /*
      Overall: Use Multer with storage to save chunks file to disk
      1. When chunk = 1 => save to disk + create process file in DB(id, total chunks, chunks, chunk_path, local_path, status)
      2. When chunk < total => save to disk + update DB
      3. When chunk = total => save to disk and trigger merge function
      4. Merge function: Read all chunks, merge them, and update DB status to complete
        If error, retry merging 2 times, if still error, update status to error.
        Then, delete all chunks and process file from disk.
      5. Return success response
      
      */
      res.status(200).json({
        status: 200,
        message: "File uploaded successfully!",
        data: {},
      });
    } catch (error: any) {
      console.log("Error uploading file:", error);
      res.status(error?.statusCode).json({
        status: error?.statusCode,
        message: error?.message,
      });
    }
  };
}

export const userController = new UserController(new UserService());
