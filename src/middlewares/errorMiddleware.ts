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
    case 'EMAIL_ALREADY_EXISTS':
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
      }); case 'TOKEN_ALREADY_EXPIRED':
      return res.status(400).json({
        message: 'Token đã hết hạn',
      });
    case 'NOT_FOUND_PRODUCT':
      return res.status(401).json({
        message: 'Không tìm thấy sản phẩm',
      });
    case 'NOT_FOUND_IMAGE':
      return res.status(401).json({
        message: 'Không tìm thấy image',
      });
    case 'GOOGLE_ACCOUNT_CANNOT_SIGN_IN_WITH_PASSWORD':
      return res.status(400).json({
        message: 'Tài khoản đăng nhập bằng Google không thể đăng nhập bằng mật khẩu',
      });
    case 'NOT_FOUND_BRAND':
      return res.status(404).json({
        message: 'Không tìm thấy thương hiệu',
      });
    case 'NOT_FOUND_CATEGORY':
      return res.status(404).json({
        message: 'Không tìm thấy danh mục',
      });
    case 'UPDATE_PROFILE_FAILED':
      return res.status(500).json({
        message: 'Cập nhật hồ sơ thất bại, vui lòng thử lại sau',
      });
    case 'NOT_FOUND_ITEMS_IN_CART':
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm trong giỏ hàng',
      });
    case 'ERROR_ADDING_TO_CART':
      return res.status(500).json({
        message: 'Lỗi khi thêm sản phẩm vào giỏ hàng, vui lòng thử lại sau',
      });
    case 'ERROR_DELETING_CART_ITEM':
      return res.status(500).json({
        message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng, vui lòng thử lại sau',
      });
    case 'NOT_FOUND_CART':
      return res.status(404).json({
        message: 'Không tìm thấy giỏ hàng',
      });
    case 'ERROR_CLEARING_CART':
      return res.status(500).json({
        message: 'Lỗi khi xóa giỏ hàng, vui lòng thử lại sau',
      });
    case 'NOT_FOUND_ADDRESS':
      return res.status(404).json({
        message: 'Không tìm thấy địa chỉ'
      })
    case 'FORBIDDEN_ADDRESS':
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện hành động này với địa chỉ'
      })
    case 'ADDRESS_REQUIRED':
      return res.status(400).json({
        message: 'Địa chỉ chi tiết là bắt buộc'
      })
    case 'ADDRESS_NOT_SELECTED':
      return res.status(400).json({
        message: 'Vui lòng chọn địa chỉ giao hàng'
      })
    case 'METHOD_NOT_SUPPORTED':
      return res.status(400).json({
        message: 'Phương thức thanh toán không hợp lệ'
      })
    case 'CART_EMPTY':
      return res.status(400).json({
        message: 'Giỏ hàng trống',
      });
    case 'BOOK_UNAVAILABLE':
      return res.status(400).json({
        message: 'Sản phẩm không khả dụng',
      });
    case 'INSUFFICIENT_STOCK':
      return res.status(400).json({
        message: 'Sản phẩm không đủ số lượng trong kho',
      });
    case 'NOT_FOUND_NEWS':
      return res.status(404).json({
        message: 'Không tìm thấy bài viết',
      });
    case 'THUMBNAIL_REQUIRED':
      return res.status(400).json({
        message: 'Ảnh thumbnail là bắt buộc',
      });
    case 'FORBIDDEN':
      return res.status(403).json({
        message: 'Bạn không có quyền thực hiện hành động này',
      });
    default:
      console.error('Unhandled error:', err);
      return res.status(500).json({
        message: 'Lỗi hệ thống, vui lòng thử lại sau',
      });
  }
};
