import express from "express";

import { addUserkeys } from "../controllers/key";

const router = express.Router();

router.post("/add", addUserkeys);
router.post("/get", addUserkeys);

export { router as keyRouter };
