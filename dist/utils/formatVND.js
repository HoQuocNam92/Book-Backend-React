"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatVND = void 0;
const formatVND = (n) => n.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' });
exports.formatVND = formatVND;
