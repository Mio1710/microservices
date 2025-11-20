import mongoose from "mongoose";
import { initPagination } from "../constants/query";
import { IBaseQuery, IPaginationQuery } from "../types/query";

export const queryBuilder = (
  entity: mongoose.Model<any>,
  query?: IBaseQuery,
  pagination: IPaginationQuery = initPagination
) => {
  let dbQuery = entity.find();

  if (query?.search) {
    const { field, value } = query.search;
    console.log("Search field:", field, "Search value:", value);

    dbQuery = entity.find({ [field]: new RegExp(value, "i") });
  }

  if (query?.sortBy) {
    dbQuery = dbQuery.sort({ [query.sortBy]: query.order === "asc" ? 1 : -1 });
  }

  const skip = (pagination.page - 1) * pagination.limit;
  dbQuery = dbQuery.skip(skip).limit(pagination.limit);

  return dbQuery;
};
