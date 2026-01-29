export interface IBaseQuery {
  search?: {
    field: string;
    value: string;
  };
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface IPaginationQuery {
  page: number;
  limit: number;
}
