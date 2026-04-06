import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const REFRESH_COOKIE = "refreshToken";

function signAccess(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function signRefresh(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.isDeleted) return res.status(401).json({ message: "Invalid credentials" });

    // Google-only accounts have no password
    if (user.googleId && !user.password) {
      return res.status(401).json({ message: "This account uses Google sign in" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccess(user._id);
    const refreshToken = signRefresh(user._id);

    setRefreshCookie(res, refreshToken);

    res.json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie(REFRESH_COOKIE);
  res.json({ message: "Logged out" });
}

export function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = signAccess(payload.id);
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}
