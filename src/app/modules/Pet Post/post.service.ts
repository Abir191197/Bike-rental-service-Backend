// post.service.ts
import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { IPetPost } from "./post.interface";
import { PetPostModel } from "./post.model";

const createPost = async (postData: Partial<IPetPost>): Promise<IPetPost> => {
  try {
    const newPost = new PetPostModel(postData);
    return await newPost.save();
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to create post");
  }
};

const getAllPosts = async (): Promise<IPetPost[]> => {
  try {
    return await PetPostModel.find().populate("authorId", "-password");
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve posts"
    );
  }
};

const getPostById = async (postId: string): Promise<IPetPost | null> => {
  try {
    const post = await PetPostModel.findById(postId).populate(
      "authorId",
      "-password"
    );
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return post;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve post"
    );
  }
};

const updatePost = async (
  postId: string,
  updateData: Partial<IPetPost>
): Promise<IPetPost | null> => {
  try {
    const updatedPost = await PetPostModel.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    ).populate("authorId", "-password");
    if (!updatedPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return updatedPost;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update post");
  }
};

const deletePost = async (postId: string): Promise<IPetPost | null> => {
  try {
    const deletedPost = await PetPostModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return deletedPost;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete post"
    );
  }
};

// const createComment = async (
//   postId: string,
//   commentData: { authorId: string; content: string }
// ): Promise<IPetPost> => {
//   try {
//     const post = await PetPostModel.findById(postId);
//     if (!post) {
//       throw new AppError(httpStatus.NOT_FOUND, "Post not found");
//     }

//     post.comments.push(commentData);
//     return await post.save();
//   } catch (error) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to create comment");
//   }
// };

const getCommentsByPostId = async (postId: string) => {
  try {
    const post = await PetPostModel.findById(postId).populate(
      "comments.authorId",
      "-password"
    );
    if (!post) {
      throw new AppError(httpStatus.NOT_FOUND, "Post not found");
    }
    return post.comments;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to retrieve comments"
    );
  }
};

// const updateComment = async (
//   postId: string,
//   commentId: string,
//   content: string
// ) => {
//   try {
//     const post = await PetPostModel.findById(postId);
//     if (!post) {
//       throw new AppError(httpStatus.NOT_FOUND, "Post not found");
//     }

//     const comment = post.comments.id(commentId);
//     if (!comment) {
//       throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
//     }

//     comment.content = content;
//     await post.save();
//     return comment;
//   } catch (error) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Failed to update comment");
//   }
// };

// const deleteComment = async (postId: string, commentId: string) => {
//   try {
//     const post = await PetPostModel.findById(postId);
//     if (!post) {
//       throw new AppError(httpStatus.NOT_FOUND, "Post not found");
//     }

//     const comment = post.comments.id(commentId);
//     if (!comment) {
//       throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
//     }

//     comment.remove();
//     await post.save();
//     return comment;
//   } catch (error) {
//     throw new AppError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to delete comment"
//     );
//   }
// };

export const PetPostService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  //createComment,
  getCommentsByPostId,
  //updateComment,
  //deleteComment,
};
