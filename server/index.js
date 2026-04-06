import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import geoip from "geoip-lite";
import { connectDB } from "./services/db.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/authRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import urlRouter from "./routes/urlRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import passportSetup from "./services/passport.js";
import { redirectUrl, getRecentActivity } from "./controllers/urlController.js";
import { authenticate } from "./middleware/auth.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Preload GeoIP database on startup
geoip.startWatchingDataUpdate();
console.log("✅ GeoIP database preloaded");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(globalLimiter);
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Session + Passport (required for Google OAuth flow)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(passportSetup.initialize());
app.use(passportSetup.session());

app.use("/api/auth", authRouter);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/url", urlRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/user", userRouter);
app.use("/api/health", healthRouter);

app.get("/api/activity/recent", authenticate, getRecentActivity);
app.get("/:shortCode", redirectUrl);

app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
