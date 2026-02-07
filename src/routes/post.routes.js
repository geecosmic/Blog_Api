import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  getMyPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import { protect, optionalAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* Public / Mixed */
router.get("/", optionalAuth, getPosts);

/* PRIVATE – used for editing */
router.get("/me/:id", protect, getMyPostById);

/* Public single post */
router.get("/:slug", getPost);

/* Auth required */
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;





