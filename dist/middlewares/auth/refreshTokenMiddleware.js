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
exports.refreshTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRepo = __importStar(require("../../modules/auth/auth.repositories.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const refreshTokenMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) {
            throw new Error('REFRESH_TOKEN_MISSING');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESHTOKEN);
        const verify = await authRepo.getRefreshTokens(decoded.id);
        if (!verify) {
            throw new Error('TOKEN_NOT_FOUND');
        }
        if (verify.ExpiresAt < new Date()) {
            throw new Error('TOKEN_ALREADY_EXPIRED');
        }
        const isMatch = await bcrypt_1.default.compare(token, verify.TokenHash);
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
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new Error('TOKEN_EXPIRED'));
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new Error('INVALID_TOKEN'));
        }
        next(error);
    }
};
exports.refreshTokenMiddleware = refreshTokenMiddleware;
exports.default = exports.refreshTokenMiddleware;
