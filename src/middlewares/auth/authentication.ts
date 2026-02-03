import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv';
import { IverifyToken } from '../../types/IverifyToken';
import type { AuthRequest } from '../../types/IAuthRequest';

const authentication = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['authorization']?.split(' ')[1];
  try {
    if (!token) {
      throw new Error('UNAUTHORIZED');
    }
    const decoded = jwt.verify(
      token!,
      process.env.REFRESHTOKEN as string,
    ) as IverifyToken;
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
