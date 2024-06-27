import express from "express";
import { continueWithGoogle } from "../controllers/auth.js";

const router = express.Router();

// login
router.post("/login", continueWithGoogle);

export default router;