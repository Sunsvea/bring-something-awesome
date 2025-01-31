// src/middleware/error.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation Error",
      details: err.errors,
    });
    return;
  }
  res.status(500).json({ error: "Internal Server Error" });
};
