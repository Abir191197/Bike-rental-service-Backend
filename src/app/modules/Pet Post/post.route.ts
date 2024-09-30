import express from "express";

import auth from "../../middlewares/auth"; // Authentication middleware
import { USER_ROLE } from "../user/user.constant";
import { petPostControllers } from "./post.controller";

const router = express.Router();

// Routes for Pet Posts
router.get(
  "/posts",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.getAllPosts // Get all pet posts
);

router.post(
  "/posts",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.createPost // Create a new pet post
);

router.get(
  "/posts/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.getPostById // Get a specific pet post by ID
);

router.put(
  "/posts/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.updatePost // Update an existing pet post
);

router.delete(
  "/posts/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.deletePost // Delete a pet post
);

// Routes for Comments
router.get(
  "/posts/:postId/comments",
  auth(USER_ROLE.admin, USER_ROLE.user),
  petPostControllers.getCommentsByPostId // Get comments for a specific post
);

// router.post(
//   "/posts/:postId/comments",
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   petPostControllers.createComment // Create a new comment on a post
// );

// router.put(
//   "/comments/:id",
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   petPostControllers.updateComment // Update a specific comment
// );

// router.delete(
//   "/comments/:id",
//   auth(USER_ROLE.admin, USER_ROLE.user),
//   petPostControllers.deleteComment // Delete a specific comment
// );

// Exporting the routes
export const PetPostRoutes = router;
