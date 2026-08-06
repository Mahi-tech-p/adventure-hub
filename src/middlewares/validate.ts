import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  (
    schema: ZodType,
    target: ValidationTarget = "body"
  ) =>
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      await schema.parseAsync(req[target]);

      next();
    } catch (error) {
      next(error);
    }
  };