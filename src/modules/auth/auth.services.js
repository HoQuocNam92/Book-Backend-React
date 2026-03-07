import bcrypt from 'bcrypt';
import * as authRepo from './auth.repositories.js';
import { generateToken } from '../../utils/token.js';
import sendMail from '../../utils/sendMail.js';
import axios from 'axios';
import { oAuth2Client } from './logic/oAuth2Client.js';
export const signUp = async (data) => {
    const user = await authRepo.findUserByEmail(data.email);
    if (user) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    return authRepo.createUser({ ...data, password: hashPassword });
};
export const signIn = async (data) => {
    const user = await authRepo.findUserByEmail(data.email);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    if (user.is_google) {
        throw new Error('GOOGLE_ACCOUNT_CANNOT_SIGN_IN_WITH_PASSWORD');
    }
    const verifyPassword = await bcrypt.compare(data.password, user.password);
    if (!verifyPassword) {
        throw new Error('PASSWORD_INCORRECT');
    }
    const accessToken = generateToken({
        id: user.id,
        role_id: user.UserRoles.map((x) => x.role_id),
        secret: process.env.ACCESSTOKEN,
        exp: '1h',
    });
    const refreshToken = generateToken({
        id: user.id,
        role_id: user.UserRoles.map((x) => x.role_id),
        secret: process.env.REFRESHTOKEN,
        exp: '7d',
    });
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepo.addRefreshTokens({
        UserId: user.id,
        TokenHash: tokenHash,
        ExpiresAt: expires,
    });
    const customer = { id: user.id, name: user?.name, role_id: user?.UserRoles };
    return { user: customer, accessToken, refreshToken };
};
export const forgotPassword = async (data) => {
    const user = await authRepo.findUserByEmail(data.email);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    if (user && user.is_google) {
        throw new Error('GOOGLE_ACCOUNT_CANNOT_RESET_PASSWORD');
    }
    const token = generateToken({
        id: user.id,
        role_id: user.UserRoles.map((x) => x.role_id),
        secret: process.env.FORGOTPASSWORD,
        exp: '10m',
    });
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await authRepo.addTokenToResetPassword({
        token: token,
        is_used: false,
        expires_at: expiresAt,
    });
    const link = `http://localhost:5173/api/auth/reset-password/${token}`;
    return sendMail(data.email, link);
};
export const verifyPassword = async (user_id) => {
    const token = await authRepo.getResetPassword(user_id);
    if (!token) {
        throw new Error('TOKEN_NOT_FOUND');
    }
    if (token?.is_used) {
        throw new Error('TOKEN_ALREADY_USED');
    }
    if (new Date() > token.expires_at) {
        throw new Error('TOKEN_ALREADY_EXPIRED');
    }
    await authRepo.updateResetPassword(user_id);
};
export const resetPassord = async (id, password) => {
    const hashPassword = await bcrypt.hash(password.password, 10);
    return await authRepo.updatePassword(id, { password: hashPassword });
};
export const refreshToken = async (data) => {
    const accessToken = generateToken({
        id: data.id,
        role_id: data.role_id,
        secret: process.env.ACCESSTOKEN,
        exp: '10m',
    });
    const refreshToken = generateToken({
        id: data.id,
        role_id: data.role_id,
        secret: process.env.REFRESHTOKEN,
        exp: '7d',
    });
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepo.addRefreshTokens({
        UserId: data.id,
        TokenHash: tokenHash,
        ExpiresAt: expires,
    });
    return { accessToken, refreshToken };
};
export const signInWithGoogle = async (code) => {
    const { tokens } = await oAuth2Client.getToken(code);
    const userRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
            Authorization: `Bearer ${tokens.access_token}`,
        },
    });
    const { name, picture, email } = userRes.data;
    const existingUser = await authRepo.findUserByEmail(email);
    if (existingUser) {
        if (!existingUser.is_google) {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        return existingUser;
    }
    await authRepo.createUser({ name, email }, 1, picture);
    const user = await authRepo.findUserByEmail(email);
    const accessToken = generateToken({
        id: user?.id,
        role_id: user?.UserRoles.map((x) => x.role_id),
        secret: process.env.ACCESSTOKEN,
        exp: '1h',
    });
    const refreshToken = generateToken({
        id: user?.id,
        role_id: user?.UserRoles.map((x) => x.role_id),
        secret: process.env.REFRESHTOKEN,
        exp: '7d',
    });
    return { user, accessToken, refreshToken };
};
export const signOut = async (user_id) => {
    return await authRepo.deleteRefreshTokens(user_id);
};
