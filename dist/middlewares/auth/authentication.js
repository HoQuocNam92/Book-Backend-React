"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv");
const authentication = (req, res, next) => {
    const token = req.cookies?.accessToken;
    try {
        if (!token) {
            throw new Error('UNAUTHORIZED');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKEN);
        if (!decoded || typeof decoded === 'string') {
            console.log("Hello");
            throw new Error('INVALID_TOKEN');
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new Error('TOKEN_EXPIRED'));
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new Error('INVALID_TOKEN'));
        }
        next(error);
    }
};
exports.default = authentication;
