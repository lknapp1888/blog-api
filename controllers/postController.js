const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");
const { userCheck, adminCheck } = require("../middleware/authMiddleware");

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

exports.postPost = [
  userCheck,
  adminCheck,

  //sanitize data
  body('title', 'title must be between 1 and 150 characters').trim()
  .isLength({ min: 1, max:150 })
  .escape(),
  body('text',  'title must be between 1 and 5000 characters').trim()
  .isLength({ min: 1, max:5000 })
  .escape(),

// async function - if errors return error json
asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
  const errors = validationResult(req);

    // Create a Post object with escaped and trimmed data.
  const post = new Post({
    title: req.body.title,
    text: req.body.text,
    author: req.user._id,
  })

  if (!errors.isEmpty()) {
    // errors present - return error json
    res.status(422).json({
      status: "fail",
      error: errors.array(),
      message: "title or text failed validation/sanitisation checks",
    });
    return
  } else {
    await post.save();
    res.status(200).json({ status: "success", data: { post } });
  }
})

];

exports.updatePost = [
  userCheck,
  adminCheck,

  //sanitize data
  body('title', 'title must be between 1 and 150 characters').trim()
  .isLength({ min: 1, max:150 })
  .escape(),
  body('text',  'title must be between 1 and 5000 characters').trim()
  .isLength({ min: 1, max:5000 })
  .escape(),

  // check that post exists
  asyncHandler(async (req, res, next) => { 

  // Extract the validation errors from a request.
  const errors = validationResult(req);

  const post = await Post.findById(req.params.id).exec();

  if (post === null) {
    res.status(404).json({
      success: false,
      message: "Post not found.",
      error: errors.array(),
    })
  } else {
    const updatedPost = new Post({
      _id: req.params.id, // This is required, or a new ID will be assigned!
      title: req.body.title,
      text: req.body.text,
    })
    await Post.findByIdAndUpdate(req.params.id, updatedPost, {});
    res.status(200).json({ status: "success", data: { updatedPost } });
  }
  }),
]

exports.deletePost = [
userCheck,
adminCheck,

asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();

  if (post === null) {
    res.status(404).json({
      success: false,
      message: "Post not found.",
    })
  } else {
    await Post.findByIdAndRemove(req.params.id);
    res.status(200).json({
      success: true,
      message: 'post successfully deleted'
    })
  }
}),
]
