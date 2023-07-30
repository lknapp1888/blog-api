const asyncHandler = require("express-async-handler");
// const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.post_comment =  asyncHandler( async (req, res, next) => {
    res.send(`post comment to ${req.params.id} - not implemented`);
});

exports.delete_comment =  asyncHandler( async (req, res, next) => {
    res.send('delete specific comment - not implemented');
});