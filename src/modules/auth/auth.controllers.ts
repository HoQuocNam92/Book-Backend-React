import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.services.js';
import {
  signUpSchema,
  signInSchema,
  emailSchema,
  passwordSchema,
} from './auth.schema.js';
import type { AuthRequest } from '../../types/IAuthRequest.js';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = signUpSchema.parse(req.body);
    const user = await authService.signUp(data);
    res.status(201).json({
      message: 'Đăng ký thành công',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = signInSchema.parse(req.body);
    const { customer, accessToken, refreshToken } = await authService.signIn(data);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800,
      sameSite: 'strict',
      secure: true,
    });
    res.status(200).json({
      message: 'Đăng nhập thành công',
      data: { customer, accessToken },
    });
  } catch (err) {
    next(err);
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = emailSchema.parse(req.body);
    const user = await authService.forgotPassword(data);
    res.status(200).json({
      message: 'Link khôi phục mật khẩu đã gữi thành công',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken, refreshToken } = await authService.refreshToken({
      id: req.user?.id!,
      role_id: req.user?.role_id!,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800,
      sameSite: 'strict',
      secure: true,
    });
    res.status(200).json({
      message: 'Reset token thành công',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.verifyPassword(req.user?.id!);
    res.status(200).json({
      message: 'Xác thực link khôi phục mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassord = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password } = req.body;
    const data = passwordSchema.parse(password);
    await authService.resetPassord(req.user?.id!, { password: data.password });
    res.status(200).json({
      message: 'Khôi phục mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};
