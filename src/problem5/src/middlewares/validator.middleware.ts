import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.body = schema.parse(req.body);
    next();
  };
}

export function validateQuery(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req.query);
    // Express 5 exposes req.query as a read-only prototype getter, so a plain
    // assignment throws. Shadowing it with an own property works instead.
    Object.defineProperty(req, "query", {
      value: parsed,
      writable: true,
      enumerable: true,
      configurable: true,
    });
    next();
  };
}

export function validateParams(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    req.params = schema.parse(req.params) as Request["params"];
    next();
  };
}
