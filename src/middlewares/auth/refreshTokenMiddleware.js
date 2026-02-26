import jwt from 'jsonwebtoken';
import * as authRepo from '../../modules/auth/auth.repositories.js';
import bcrypt from 'bcrypt';
export const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            throw new Error('REFRESH_TOKEN_MISSING');
        }
        const decoded = jwt.verify(token, process.env.REFRESHTOKEN);
        const verify = await authRepo.getRefreshTokens(decoded.id);
        if (!verify) {
            throw new Error('TOKEN_NOT_FOUND');
        }
        if (verify.ExpiresAt < new Date()) {
            throw new Error('TOKEN_ALREADY_EXPIRED');
        }
        const isMatch = await bcrypt.compare(token, verify.TokenHash);
        if (!isMatch) {
            throw new Error('TOKEN_HASH_NOT_MATCH');
        }
        req.user = {
            id: decoded.id,
            role_id: decoded.role_id,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new Error('TOKEN_EXPIRED'));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new Error('INVALID_TOKEN'));
        }
        next(error);
    }
};
export default refreshTokenMiddleware;
