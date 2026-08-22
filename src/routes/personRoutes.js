import express from "express";
import uploadLogos from "../middleware/uploadMiddleware.js";
import {
  createPersonController,
  getAllPersonsController,
  seedPersonController,
} from "../controllers/personController.js";

const router = express.Router();

router.post(
  "/",
  uploadLogos,
  createPersonController
);

router.get(
  "/",
  getAllPersonsController
);

router.post(
  "/seed",
  seedPersonController
);

export default router;