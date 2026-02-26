"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const app_js_1 = __importDefault(require("./app.js"));
app_js_1.default.listen(8080, () => {
    console.log('Server running on port 8080');
});
