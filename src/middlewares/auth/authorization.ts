import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IverifyToken } from '../../interfaces/IverifyToken';
import * as authRepo from '../../modules/auth/auth.repositories.js';

import { AuthRequest } from '../../interfaces/IAuthRequest';
const authorization = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    try {
        if (!token) {
            throw new Error('UNAUTHORIZED');
        }
        const decoded = jwt.verify(
            token!,
            process.env.ACCESSTOKEN as string,
        ) as IverifyToken;
        if (!decoded || typeof decoded === 'string') {
            throw new Error('INVALID_TOKEN');
        }
        req.user = {
            id: decoded.id,
            role_id: decoded.role_id,
        };
        const user = await authRepo.findUserById(decoded.id);
        if (!user) {
            throw new Error('USER_NOT_FOUND');
        }

        if (!user.UserRoles.map((x) => x.role_id).every((role) => decoded.role_id.includes(role) && user.UserRoles.map((x) => x.role_id).includes(1))) {
            throw new Error('FORBIDDEN');
        }

        next();
    } catch (error) {
        next(error);
    }
}

export default authorization;