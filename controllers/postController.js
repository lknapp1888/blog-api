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

exports.postPost = [
  // Verify that user is logged in
  (req, res, next) => {
    if (req.user === undefined) {
        res.status(401).json({
            status: "fail",
            error: "unauthorized",
            message: "User not logged in or session expired. Please log in to access this resource.",
          });  
          return            
    }
    next()
},

  //verify that user is admin
(req, res, next) => {
  if (!req.user.admin) {
      res.status(401).json({
          status: "fail",
          error: "unauthorized",
          message: "User is not administrator - cannot send post",
        });  
        return            
  }
  next()
},

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

exports.updatePost = asyncHandler(async (req, res, next) => {
  res.send("update (PUT) post data - not implemented");
});

exports.deletePost = asyncHandler(async (req, res, next) => {
  res.send("delete (DELETE) post data - not implemented");
});
