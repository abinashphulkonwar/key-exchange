import express from "express";
import {
  currentUserController,
  loginController,
  signupController,
} from "../controllers/auth";
import { currentUser, requiredAuth } from "../../services/current-user";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/current-user", currentUser, requiredAuth, currentUserController);

export { router as authRouter };
