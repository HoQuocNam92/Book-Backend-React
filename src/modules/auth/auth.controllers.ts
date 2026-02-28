import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.services.js';
import {
  signUpSchema,
  signInSchema,
  emailSchema,
  passwordSchema,
} from './auth.schema.js';
import type { AuthRequest } from '../../interfaces/IAuthRequest.js';
import { oAuth2Client } from './logic/oAuth2Client.js';

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
    const { user, accessToken, refreshToken } = await authService.signIn(data);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });
    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: user,
    });
  } catch (err) {
    next(err);
  }
};

export const googleCallback = async (req: Request,
  res: Response,
  next: NextFunction,) => {
  try {
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ["openid", "email", "profile"]
    })
    return res.redirect(url);
  } catch (err) {
    next(err);
  }
}

export const signInWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");
    const { accessToken, refreshToken }: any = await authService.signInWithGoogle(code as string);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });
    return res.redirect("http://localhost:5173/");
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
    return res.status(200).json({
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });
    return res.status(200).json({
      message: 'Làm mới token thành công',
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
    return res.status(200).json({
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
    return res.status(200).json({
      message: 'Khôi phục mật khẩu thành công',
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (
  req: AuthRequest,
  res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }
    await authService.signOut(req.user?.id!);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Đăng xuất thất bại',
    });
  }
};