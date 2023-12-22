import express from "express";

import { userListController } from "../controllers/chat";

const router = express.Router();

router.get("/users-list", userListController);

export { router as chatRouter };
