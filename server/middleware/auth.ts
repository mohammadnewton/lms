import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import { redis } from '../utils/redis';

// authenticated User
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token;

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

  if (!decoded) {
    return next(new ErrorHandler('Access token is not valid', 400));
  }

  const user = await redis.get(decoded.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 400));
  }

  req.user = JSON.parse(user);

  next();
});

//  validate user role
export const authorizeRoles = (...roles: string[]) => {
  return(req:Request, res:Response, next:NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(new ErrorHandler(`Role ${req.user?.role} is not allowed`, 403));
    }
    next();
  }
}