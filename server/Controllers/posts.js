import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      likes: {},
      comments: [],
    });

    // Vérifiez si une image a été téléchargée
    if (req.file) {
      newPost.picturePath = req.file.filename;
    }
    await newPost.save();

    const posts = await Post.find().sort({ _id: -1 }); // Tri des posts par ordre décroissant de l'ID
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* CREATE COMMENT */
export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await post.createComment(userId, user.firstName, user.lastName, comment);

    res.status(201).json(post.getComments());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET COMMENTS */
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.getComments());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndRemove(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.commentUserId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    comment.remove();
    await post.save();

    res.status(200).json(post.getComments());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
