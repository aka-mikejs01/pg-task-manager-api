import { Router } from "express";
import { authValidator } from "../validators/authValidator.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refresh,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", authValidator, registerUser);
router.post("/login", authValidator, loginUser);
router.post("/logout", logoutUser);

router.get("/refresh", refresh);

export default router;
