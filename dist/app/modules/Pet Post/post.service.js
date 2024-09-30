"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetPostService = void 0;
// post.service.ts
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const post_model_1 = require("./post.model");
const createPost = (postData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPost = new post_model_1.PetPostModel(postData);
        return yield newPost.save();
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create post");
    }
});
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield post_model_1.PetPostModel.find().populate("authorId", "-password");
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve posts");
    }
});
const getPostById = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.PetPostModel.findById(postId).populate("authorId", "-password");
        if (!post) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return post;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve post");
    }
});
const updatePost = (postId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedPost = yield post_model_1.PetPostModel.findByIdAndUpdate(postId, updateData, { new: true, runValidators: true }).populate("authorId", "-password");
        if (!updatedPost) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return updatedPost;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update post");
    }
});
const deletePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedPost = yield post_model_1.PetPostModel.findByIdAndDelete(postId);
        if (!deletedPost) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return deletedPost;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete post");
    }
});
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
const getCommentsByPostId = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.PetPostModel.findById(postId).populate("comments.authorId", "-password");
        if (!post) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Post not found");
        }
        return post.comments;
    }
    catch (error) {
        throw new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to retrieve comments");
    }
});
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
exports.PetPostService = {
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
