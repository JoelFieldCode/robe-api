import { ErrorRequestHandler } from "express";
import HttpException from "../exceptions/HttpException";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof HttpException) {
    return res.status(error.status).send({
      status: error.status,
      message: error.message,
    });
  }
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  return res.status(status).send({
    status,
    message,
  });
};
