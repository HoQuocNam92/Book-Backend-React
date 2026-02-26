"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.signInWithGoogle = exports.refreshToken = exports.resetPassord = exports.verifyPassword = exports.forgotPassword = exports.signIn = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const authRepo = __importStar(require("./auth.repositories.js"));
const token_js_1 = require("../../utils/token.js");
const sendMail_js_1 = __importDefault(require("../../utils/sendMail.js"));
const axios_1 = __importDefault(require("axios"));
const oAuth2Client_js_1 = require("./logic/oAuth2Client.js");
const signUp = async (data) => {
    const user = await authRepo.findUserByEmail(data.email);
    if (user) {
        throw new Error('EMAIL_ALREADY_EXISTS');
    }
    const hashPassword = await bcrypt_1.default.hash(data.password, 10);
    return authRepo.createUser({ ...data, password: hashPassword });
};
exports.signUp = signUp;
const signIn = async (data) => {
    const user = await authRepo.findUserByEmail(data.email);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    if (user.is_google) {
        throw new Error('GOOGLE_ACCOUNT_CANNOT_SIGN_IN_WITH_PASSWORD');
    }
    const verifyPassword = await bcrypt_1.default.compare(data.password, user.password);
    if (!verifyPassword) {
        throw new Error('PASSWORD_INCORRECT');
    }
    const accessToken = (0, token_js_1.generateToken)({
        id: user.id,
        role_id: user.UserRoles.map((x) => x.role_id),
        secret: process.env.ACCESSTOKEN,
        exp: '1h',
    });
    const refreshToken = (0, token_js_1.generateToken)({
        id: user.id,
        role_id: user.UserRoles.map((x) => x.role_id),
        secret: process.env.REFRESHTOKEN,
        exp: '7d',
    });
    const tokenHash = await bcrypt_1.default.hash(refreshToken, 10);
    const experis = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepo.addRefreshTokens({
        UserId: user.id,
        TokenHash: tokenHash,
        ExpiresAt: experis,
    });
    const customer = { id: user.id, name: user?.name, role_id: user?.UserRoles };
    return { user: customer, accessToken, refreshToken };
};
exports.signIn = signIn;
const forgotPassword = async (data) => {
    const user = await authRepo.findUserByEmail(data.email);
    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }
    if (user && user.is_google) {
        throw new Error('GOOGLE_ACCOUNT_CANNOT_RESET_PASSWORD');
    }
    const token = (0, token_js_1.generateToken)({
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
    return (0, sendMail_js_1.default)(data.email, link);
};
exports.forgotPassword = forgotPassword;
const verifyPassword = async (user_id) => {
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
exports.verifyPassword = verifyPassword;
const resetPassord = async (id, password) => {
    const hashPassword = await bcrypt_1.default.hash(password.password, 10);
    return await authRepo.updatePassword(id, { password: hashPassword });
};
exports.resetPassord = resetPassord;
const refreshToken = async (data) => {
    const accessToken = (0, token_js_1.generateToken)({
        id: data.id,
        role_id: data.role_id,
        secret: process.env.ACCESSTOKEN,
        exp: '10m',
    });
    const refreshToken = (0, token_js_1.generateToken)({
        id: data.id,
        role_id: data.role_id,
        secret: process.env.REFRESHTOKEN,
        exp: '7d',
    });
    const tokenHash = await bcrypt_1.default.hash(refreshToken, 10);
    const experis = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepo.addRefreshTokens({
        UserId: data.id,
        TokenHash: tokenHash,
        ExpiresAt: experis,
    });
    return { accessToken, refreshToken };
};
exports.refreshToken = refreshToken;
const signInWithGoogle = async (code) => {
    const { tokens } = await oAuth2Client_js_1.oAuth2Client.getToken(code);
    const userRes = await axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
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
    const accessToken = (0, token_js_1.generateToken)({
        id: user?.id,
        role_id: user?.UserRoles.map((x) => x.role_id),
        secret: process.env.ACCESSTOKEN,
        exp: '1h',
    });
    const refreshToken = (0, token_js_1.generateToken)({
        id: user?.id,
        role_id: user?.UserRoles.map((x) => x.role_id),
        secret: process.env.REFRESHTOKEN,
        exp: '7d',
    });
    return { user, accessToken, refreshToken };
};
exports.signInWithGoogle = signInWithGoogle;
const signOut = async (user_id) => {
    return await authRepo.deleteRefreshTokens(user_id);
};
exports.signOut = signOut;
