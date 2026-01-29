import { initPagination } from "../constants/query";
import { User } from "../database";
import { IPaginationQuery } from "../types/query";
import { queryBuilder } from "../utils/queryBuilder";

export class UserService {
  async getAllUsers(query: any, pagination: IPaginationQuery = initPagination) {
    try {
      if (query.search) {
        query.search = {
          field: "name", // Default search field
          value: query.search || "", // Default search value
        };
      }
      console.log("Query parameters for fetching users:", query, pagination);

      const users = await queryBuilder(User, query, pagination).exec();
      return users;
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw {
        statusCode: 500,
        message: "Internal server error while fetching users",
      };
    }
  }
}
