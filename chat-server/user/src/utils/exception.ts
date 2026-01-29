export class BadRequestException extends Error {
  private status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}
export class HttpException extends Error {
  private status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
