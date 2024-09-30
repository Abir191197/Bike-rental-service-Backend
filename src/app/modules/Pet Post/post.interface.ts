import { Types } from "mongoose";

// Interface for a pet post
interface PetPost {
  id: string; // Unique identifier for the post
  authorId: Types.ObjectId; // ID of the author
  title: string; // Title of the post
  content: string; // Content of the post
  category: "Tip" | "Story"; // Category of the post
  isPremium: boolean; // Indicates if the post is premium
  PremiumAmount: number;
  images: string[]; // Array of image URLs
  createdAt: Date; // Creation date of the post
  updatedAt: Date; // Last updated date of the post
  upvote: number; // Number of upvotes
  downvote: number; // Number of downvotes
}

// Interface for a comment
interface Comment {
  _id: any;
  id: string; // Unique identifier for the comment
  postId: Types.ObjectId; // ID of the post the comment belongs to
  authorId: Types.ObjectId; // ID of the author of the comment
  content: string; // Content of the comment
  createdAt: Date; // Creation date of the comment
  updatedAt: Date; // Last updated date of the comment
}

// Interface representing a pet post along with its comments
export interface IPetPost {
  post: PetPost; // The pet post
  comments: Comment[]; // Array of comments associated with the post
}
