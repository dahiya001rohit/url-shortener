import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./services/db.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/authRoutes.js";
import urlRouter from "./routes/urlRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import { redirectUrl } from "./controllers/urlController.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(globalLimiter);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/url", urlRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/health", healthRouter);

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
