import { generateToken } from "../token";


export const createRefreshToken = (user: any) =>
    generateToken({
        id: user.id,
        role_id: user.role_id,
        secret: process.env.REFRESHTOKEN!,
        exp: '7d',
    });