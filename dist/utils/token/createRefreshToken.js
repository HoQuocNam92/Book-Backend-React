"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = void 0;
const token_1 = require("../token");
const createRefreshToken = (user) => (0, token_1.generateToken)({
    id: user.id,
    role_id: user.UserRoles.map((x) => x.role_id),
    secret: process.env.REFRESHTOKEN,
    exp: '7d',
});
exports.createRefreshToken = createRefreshToken;
