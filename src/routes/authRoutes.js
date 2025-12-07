import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, async (req, res) => {
  res.json({ msg: "Protected route accessed!", userId: req.userId });
});

export default router;