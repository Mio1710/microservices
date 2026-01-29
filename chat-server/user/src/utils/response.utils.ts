import { Response } from "express";

interface IResponse {
  status?: number;
  message: string;
  data?: any;
}
class ResponseUtils {
  success(res: Response, response: IResponse) {
    return res.status(response.status ?? 200).json({
      message: response.message,
      data: response.data,
    });
  }

  error(res: Response, response: IResponse) {
    return res.status(response.status ?? 500).json({
      status: response.status ?? res.statusCode,
      message: response.message,
    });
  }
}

export const resUtils = new ResponseUtils();
