import express from "express";
import { adminLogin, continueWithGoogle } from "../controllers/auth.js";
import passport from "passport";
import "../controllers/passport.js";

const router = express.Router();

// login
router.post("/login", continueWithGoogle);
router.post("/admin-login", adminLogin);

// passport
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/callback?failed=true`,
  }),
  (req, res) => {
    res.redirect(
      `${process.env.FRONTEND_URL}/callback?token=${req.user.token}&studentId=${req.user._id}`
    );
  }
);

export default router;
