import express from "express";
import { signupController } from "../controllers/auth";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", signupController);

export { router as authRouter };
