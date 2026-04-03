import { Router } from "express";
import { body } from "express-validator";
import {
  shortenUrl, getMyUrls, deleteUrl, editUrl, getStats, getRecentActivity,
} from "../controllers/urlController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { shortenLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/shorten",
  authenticate,
  shortenLimiter,
  validate([body("originalUrl").isURL().withMessage("A valid URL is required")]),
  shortenUrl
);
router.get("/my-urls", authenticate, getMyUrls);
router.get("/stats", authenticate, getStats);
router.patch("/:id", authenticate, editUrl);
router.delete("/:id", authenticate, deleteUrl);

// Activity endpoint — mounted at /api/activity
export { getRecentActivity };

export default router;
