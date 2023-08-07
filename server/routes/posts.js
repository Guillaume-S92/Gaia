import express from "express";
import {
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost,
  createComment,
  deleteComment,
  getComments,
} from "../Controllers/posts.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:id/comments", verifyToken, getComments);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* CREATE */
router.post("/:id/comment", verifyToken, createComment);

/* DELETE */
router.delete("/:id", deletePost);
router.delete("/:id/comment/:commentId", verifyToken, deleteComment);

export default router;
