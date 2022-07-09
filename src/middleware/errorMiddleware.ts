import { Request, Response } from "express";
import HttpException from "../exceptions/HttpException";

function errorMiddleware(
  error: TypeError | HttpException,
  _req: Request,
  res: Response,
) {
  console.log(res)
  let httpException: HttpException
  if (!(error instanceof HttpException)) {
    httpException = new HttpException(
      500, 'Something went wrong'
    );
  }
  const status = httpException.status || 500;
  const message = httpException.message || "Something went wrong";
  return res.status(status).send({
    status,
    message,
  });
}

export default errorMiddleware;
