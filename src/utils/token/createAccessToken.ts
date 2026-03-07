import { generateToken } from "../token";

export const createAccessToken = (user: any) =>
    generateToken({
        id: user.id,
        role_id: user.role_id,
        secret: process.env.ACCESSTOKEN!,
        exp: '10m',
    });