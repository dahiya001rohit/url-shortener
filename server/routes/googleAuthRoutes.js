import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const CLIENT = (process.env.CLIENT_URL || "").replace(/\/$/, "");

const router = express.Router();

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT}/login?error=google_failed`,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`${CLIENT}/auth/callback?token=${accessToken}`);
    } catch (err) {
      res.redirect(`${CLIENT}/login?error=server_error`);
    }
  }
);

export default router;
