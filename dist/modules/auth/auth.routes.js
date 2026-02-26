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
const authentication_js_1 = __importDefault(require("../../middlewares/auth/authentication.js"));
const refreshTokenMiddleware_js_1 = __importDefault(require("../../middlewares/auth/refreshTokenMiddleware.js"));
const authController = __importStar(require("./auth.controllers.js"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/google', authController.googleCallback);
router.get('/google/callback', authController.signInWithGoogle);
router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-passwowrd', authentication_js_1.default, authController.verifyPassword);
router.post('/reset-password', authController.resetPassord);
router.post('/refresh-token', refreshTokenMiddleware_js_1.default, authController.refreshToken);
router.post('/sign-out', authentication_js_1.default, authController.signOut);
exports.default = router;
