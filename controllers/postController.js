const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.getPosts = asyncHandler(async (req, res, next) => {
  try {
    const posts = await Post.find().exec();
    res.json({
      status: "success",
      data: posts,
    });
  } catch (error) {
    res.json({
      status: "error",
      data: error,
    });
  }
});

exports.getPost = asyncHandler(async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).
      populate('comments')
      .exec();
      
    res.json({
      status: "success",
      data: post,
    });
  } catch (error) {
    res.json({
      status: "fail",
      date: {
        message: `id not found`,
        id: req.params.id,
      },
    });
  }
});

exports.postPost = asyncHandler(async (req, res, next) => {
  res.send("POST post data - not implemented");
});

exports.updatePost = asyncHandler(async (req, res, next) => {
  res.send("update (PUT) post data - not implemented");
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  res.send("delete (DELETE) post data - not implemented");
});
