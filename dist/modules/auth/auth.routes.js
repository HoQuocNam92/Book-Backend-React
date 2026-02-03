import * as authController from "#/modules/auth/auth.controllers.js";
import express from "express";
const router = express.Router();
router.post("/", authController.SignUp);
export default router;
