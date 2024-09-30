// post.controller.ts
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IPetPost } from "./post.interface";
import { PetPostService } from "./post.service";

const getAllPosts = catchAsync(async (req, res) => {
  const posts = await PetPostService.getAllPosts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet posts retrieved successfully",
    data: posts,
  });
});

const createPost = catchAsync(async (req, res) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
    });
  }
  const newPost: Partial<IPetPost> = { ...req.body, authorId: req.user._id };
  const createdPost = await PetPostService.createPost(newPost as any);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Pet post created successfully",
    data: createdPost,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const post = await PetPostService.getPostById(req.params.id);
  if (!post) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Pet post not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet post retrieved successfully",
    data: post,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const updatedPost = await PetPostService.updatePost(req.params.id, req.body);
  if (!updatedPost) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Pet post not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet post updated successfully",
    data: updatedPost,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const deletedPost = await PetPostService.deletePost(req.params.id);
  if (!deletedPost) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Pet post not found",
      data: null,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pet post deleted successfully",
    data: null,
  });
});

const getCommentsByPostId = catchAsync(async (req, res) => {
  const comments = await PetPostService.getCommentsByPostId(req.params.postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: comments,
  });
});




//   const updatedComment = await PetPostService.updateComment(
//     req.params.postId,
//     req.params.id,
//     req.body.content
//   );
//   if (!updatedComment) {
//     return sendResponse(res, {
//       statusCode: httpStatus.NOT_FOUND,
//       success: false,
//       message: "Comment not found",
//       data: null,
//     });
//   }
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Comment updated successfully",
//     data: updatedComment,
//   });
// });

// const deleteComment = catchAsync(async (req, res) => {
//   const deletedComment = await PetPostService.deleteComment(
//     req.params.postId,
//     req.params.id
//   );
//   if (!deletedComment) {
//     return sendResponse(res, {
//       statusCode: httpStatus.NOT_FOUND,
//       success: false,
//       message: "Comment not found",
//       data: null,
//     });
//   }
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Comment deleted successfully",
//     data: null,
//   });
// });

export const petPostControllers = {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getCommentsByPostId,
  
};
