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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.resetPassord = exports.verifyPassword = exports.refreshToken = exports.forgotPassword = exports.signInWithGoogle = exports.googleCallback = exports.signIn = exports.signUp = void 0;
const authService = __importStar(require("./auth.services.js"));
const auth_schema_js_1 = require("./auth.schema.js");
const oAuth2Client_js_1 = require("./logic/oAuth2Client.js");
const signUp = async (req, res, next) => {
    try {
        const data = auth_schema_js_1.signUpSchema.parse(req.body);
        const user = await authService.signUp(data);
        res.status(201).json({
            message: 'Đăng ký thành công',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.signUp = signUp;
const signIn = async (req, res, next) => {
    try {
        const data = auth_schema_js_1.signInSchema.parse(req.body);
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
    }
    catch (err) {
        next(err);
    }
};
exports.signIn = signIn;
const googleCallback = async (req, res, next) => {
    try {
        const url = oAuth2Client_js_1.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: ["openid", "email", "profile"]
        });
        return res.redirect(url);
    }
    catch (err) {
        next(err);
    }
};
exports.googleCallback = googleCallback;
const signInWithGoogle = async (req, res, next) => {
    try {
        const code = req.query.code;
        if (!code)
            return res.status(400).send("Missing code");
        const { accessToken, refreshToken } = await authService.signInWithGoogle(code);
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
    }
    catch (err) {
        next(err);
    }
};
exports.signInWithGoogle = signInWithGoogle;
const forgotPassword = async (req, res, next) => {
    try {
        const data = auth_schema_js_1.emailSchema.parse(req.body);
        const user = await authService.forgotPassword(data);
        return res.status(200).json({
            message: 'Link khôi phục mật khẩu đã gữi thành công',
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.forgotPassword = forgotPassword;
const refreshToken = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = await authService.refreshToken({
            id: req.user?.id,
            role_id: req.user?.role_id,
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
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
const verifyPassword = async (req, res, next) => {
    try {
        await authService.verifyPassword(req.user?.id);
        return res.status(200).json({
            message: 'Xác thực link khôi phục mật khẩu thành công',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyPassword = verifyPassword;
const resetPassord = async (req, res, next) => {
    try {
        const { password } = req.body;
        const data = auth_schema_js_1.passwordSchema.parse(password);
        await authService.resetPassord(req.user?.id, { password: data.password });
        return res.status(200).json({
            message: 'Khôi phục mật khẩu thành công',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.resetPassord = resetPassord;
const signOut = async (req, res) => {
    try {
        await authService.signOut(req.user?.id);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({
            message: 'Đăng xuất thành công',
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Đăng xuất thất bại',
        });
    }
};
exports.signOut = signOut;
