import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required !"],
    },
    description: {
      type: String,
      required: [true, "description is required !"],
    },
    avatar: {
      type: String,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please login first"],
      ref: "User",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
