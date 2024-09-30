import mongoose, { Model, Schema } from "mongoose";
import { IPetPost } from "./post.interface";

const CommentSchema = new Schema({
  authorId: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PetPostSchema = new Schema(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ["Tip", "Story"], required: true },
    isPremium: { type: Boolean, default: false },
    PremiumAmount:{ type: Number, default:null },
    images: [String],
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

export const PetPostModel: Model<IPetPost> = mongoose.model<IPetPost>(
  "PetPost",
  PetPostSchema,
  "PetPost"
);
