import { Request, Response, NextFunction } from "express";

export const tokenHeaderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.headers.access_token && !req.cookies.access_token) {
    req.cookies.access_token = req.headers.access_token;
  }
  if (req.headers.refresh_token && !req.cookies.refresh_token) {
    req.cookies.refresh_token = req.headers.refresh_token;
  }

  res.setHeader(
    "access_token",
    appendBearer(req.headers.access_token as string),
  );
  res.setHeader(
    "refresh_token",
    appendBearer(req.headers.refresh_token as string),
  );

  next();
};

const appendBearer = (str: string): string => {
  if (!str) return null;
  if (!str.startsWith("Bearer ")) return "Bearer " + str;
  return str;
};
