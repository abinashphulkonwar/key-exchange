import express from "express";
import {
  currentUserController,
  loginController,
  signupController,
} from "../controllers/auth";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/current-user", currentUserController);

export { router as authRouter };
