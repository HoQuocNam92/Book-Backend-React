"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (data) => {
    return jsonwebtoken_1.default.sign({ id: data.id, role_id: data.role_id }, data.secret, {
        expiresIn: data.exp,
    });
};
exports.generateToken = generateToken;
