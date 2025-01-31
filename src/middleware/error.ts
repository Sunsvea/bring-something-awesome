import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof ZodError)) {
    console.error(err);
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
    });
  } else {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
