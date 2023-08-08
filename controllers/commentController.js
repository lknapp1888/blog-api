const asyncHandler = require("express-async-handler");
const Comment = require("../models/comment");
const User = require("../models/user");
const Post = require("../models/post");

const { body, validationResult } = require("express-validator");
const { userCheck } = require("../middleware/authMiddleware");

exports.postComment = [
    userCheck,
    body('title').trim()
    .isLength({ min: 1, max:150 })
    .escape(),
    body('text').trim()
    .isLength({ min: 1, max:5000 })
    .escape(),

    asyncHandler(async (req, res, next) => {
    try {
      const [author, post] = await Promise.all([
        User.findById(req.user.id).exec(),
        Post.findById(req.params.id).exec(),
      ]);
  
      if (!author || !post) {
        return res.status(404).json({ message: "Author or Post not found." });
      }
  
      // Create and save the comment directly with create()
      const comment = await Comment.create({
        title: req.body.title,
        text: req.body.text,
        author: author.id,
        postId: post.id,
      });
  
      // Update the comments field in the Post collection
      await Post.updateOne(
        { _id: post.id },
        { $push: { comments: comment._id } }
      );
  
      // Send the response with the created comment
      res.json({ status: "success", data: { comment } });
    } catch (error) {
      next(error);
    }
  })]

exports.deleteComment = asyncHandler(async (req, res, next) => {
  res.send("delete specific comment - not implemented");
});
