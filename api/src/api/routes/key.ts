import express from "express";

import { addUserkeys } from "../controllers/key";

const router = express.Router();

router.post("/add", addUserkeys);

export { router as keyRouter };
