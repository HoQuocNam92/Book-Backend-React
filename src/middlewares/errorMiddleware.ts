import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    console.error(
      'ZodError:',
      err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );

    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  switch (err.message) {
    case 'EMAIL_EXISTS':
      return res.status(409).json({
        message: 'Email đã tồn tại',
      });
    case 'EMAIL_NOT_EXIST':
      return res.status(404).json({
        message: 'Email chưa tồn tại',
      });
    case 'PASSWORD_INCORRECT':
      return res.status(400).json({
        message: 'Mật khẩu không chính xác',
      });

    case 'USER_NOT_FOUND':
      return res.status(404).json({
        message: 'Không tìm thấy người dùng',
      });

    case 'GOOGLE_ACCOUNT_CANNOT_RESET_PASSWORD':
      return res.status(400).json({
        message: 'Tài khoản đăng nhập bằng Google không thể đặt lại mật khẩu',
      });
    case 'UNAUTHORIZED':
      return res.status(401).json({
        message: 'Bạn chưa đăng nhập hoặc token không hợp lệ',
      });
    case 'TOKEN_EXPIRED':
      return res.status(401).json({
        message: 'Token đã hết hạn, vui lòng đăng nhập lại',
      });
    case 'REFRESH_TOKEN_MISSING':
      return res.status(401).json({
        message: 'Không tìm thấy refresh token. Vui lòng đăng nhập lại.',
      });

    case 'INVALID_TOKEN':
      return res.status(401).json({
        message: 'Token không hợp lệ',
      });
    case 'TOKEN_NOT_FOUND':
      return res.status(404).json({
        message: 'Token không tồn tại',
      });

    case 'TOKEN_ALREADY_USED':
      return res.status(400).json({
        message: 'Token đã được sử dụng',
      });

    case 'TOKEN_ALREADY_EXPIRED':
      return res.status(400).json({
        message: 'Token đã hết hạn',
      });

    default:
      console.error('Unhandled error:', err);
      return res.status(500).json({
        message: 'Lỗi hệ thống, vui lòng thử lại sau',
      });
  }
};
