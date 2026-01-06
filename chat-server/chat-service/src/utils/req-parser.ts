const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export interface ReqParams {
  page: number;
  limit: number;
  offset: number;
}

export class ReqParser {
  static parsePaginationParams(req: any): ReqParams {
    const page = req.query.page ? parseInt(req.query.page, 10) : DEFAULT_PAGE;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : DEFAULT_LIMIT;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : (page - 1) * limit;

    return { page, limit, offset };
  }
}
