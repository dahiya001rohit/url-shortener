import { Router } from "express";
import { body } from "express-validator";
import { shortenUrl, getMyUrls, deleteUrl } from "../controllers/urlController.js";
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
router.delete("/:id", authenticate, deleteUrl);

export default router;
