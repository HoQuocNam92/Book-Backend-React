"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = void 0;
const token_1 = require("../token");
const createAccessToken = (user) => (0, token_1.generateToken)({
    id: user.id,
    role_id: user.UserRoles.map((x) => x.role_id),
    secret: process.env.ACCESSTOKEN,
    exp: '10m',
});
exports.createAccessToken = createAccessToken;
