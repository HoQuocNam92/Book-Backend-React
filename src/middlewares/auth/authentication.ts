import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';
import { IverifyToken } from '../../interfaces/IverifyToken.js';
import type { AuthRequest } from '../../interfaces/IAuthRequest.js';

const authentication = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;
  try {
    if (!token) {
      throw new Error('UNAUTHORIZED');
    }

    const decoded = jwt.verify(
      token!,
      process.env.ACCESSTOKEN as string,
    ) as IverifyToken;
    if (!decoded || typeof decoded === 'string') {
      console.log("Hello")
      throw new Error('INVALID_TOKEN');
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('TOKEN_EXPIRED'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error('INVALID_TOKEN'));
    }
    next(error);
  }
};
export default authentication;
