import express from "express";
import { adminLogin, continueWithGoogle } from "../controllers/auth.js";

const router = express.Router();

// login
router.post("/login", continueWithGoogle);
router.post("/admin-login", adminLogin);

// router.post("/admin-login")

export default router;