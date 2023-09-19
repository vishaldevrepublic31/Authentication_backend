import Post from "../model/post.js";
import { User } from "../model/user.js";

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate("creator");
    if (!posts)
      return res
        .status(400)
        .json({ success: false, message: "Not any post here!" });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Somthing wenr wrong!",
      error,
    });
  }
};

const createPost = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.id;
  try {
    if (!title || !description)
      return res
        .status(400)
        .json({ success: false, message: "Please fill all data!" });
    const post = await Post.create({
      title,
      description,
      avatar: {
        public_id: title,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
      creator: userId,
    });

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found!" });
    } else {
      await post.save();

      user.post.push(post);
      await user.save();

      res.status(201).json({
        success: true,
        message: "Post created successFully",
        post,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Somthing wenr wrong!",
      error,
    });
  }
};

const updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.id;
  const { title, description } = req.body;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "post not found!" });
    }

    if (post.creator.toString() !== userId.toString())
      return res
        .status(400)
        .json({ success: false, message: "Unauthenticate User!" });

    const updatePost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatePost)
      return res
        .status(400)
        .json({ success: false, message: "Post not update" });

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Somthing wenr wrong!",
      error,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "user not found!" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "post not found!" });
    }

    if (post.creator.toString() !== userId.toString())
      return res
        .status(400)
        .json({ success: false, message: "Unauthenticate User!" });
    // -------------- //
    const deleteUserPost = await Post.findByIdAndDelete(postId).populate(
      "creator"
    );

    deleteUserPost.creator.post.pull(deleteUserPost);
    await deleteUserPost.creator.save();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Somthing wenr wrong!",
      error,
    });
  }
};

const getUserPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("post");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found!" });
    }

    res.status(200).json({
      success: true,
      posts: user.post,
    });
    console.log("user posts ->", user.post);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Somthing wenr wrong!",
      error,
    });
  }
};

const myPosts = async (req, res) => {
  const id = req.id;
  const user = await User.findById(id).populate("post");
  console.log(user);
  res.status(200).json({
    success: true,
    message: "LoggedIn",
    posts: user.post,
  });
};
export {
  getAllPost,
  createPost,
  deletePost,
  updatePost,
  getUserPosts,
  myPosts,
};
