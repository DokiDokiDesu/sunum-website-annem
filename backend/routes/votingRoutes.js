import express from "express";
import {
  getAllVotingTopics,
  getVotingTopicsForAdmin,
  upsertVotingTopic,
  deleteVotingTopic,
  voteForTopic,
  resetVotes,
} from "../controllers/votingController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getAllVotingTopics);
router.post("/:id/vote", voteForTopic);

// Admin routes
router.get("/admin/all", authMiddleware, getVotingTopicsForAdmin);
router.post("/admin", authMiddleware, upsertVotingTopic);
router.delete("/admin/:id", authMiddleware, deleteVotingTopic);
router.post("/admin/reset-votes", authMiddleware, resetVotes);

export default router;
