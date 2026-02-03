import authRoute from "#/modules/auth/auth.routes.js";
import express from "express";
const router = express.Router();
router.post("/auth", authRoute);
export default router;
