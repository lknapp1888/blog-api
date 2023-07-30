const asyncHandler = require("express-async-handler");
// const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.get_posts =  asyncHandler( async (req, res, next) => {
    res.send('get posts data - not implemented');
});

exports.get_post = asyncHandler(async(req, res, next) => {
    res.send('get post data - not implemented');
});

exports.post_post = asyncHandler(async(req, res, next) => {
    res.send('POST post data - not implemented');
});

exports.update_post = asyncHandler(async(req, res, next) => {
    res.send('update (PUT) post data - not implemented');
});

exports.delete_post = asyncHandler(async(req, res, next) => {
    res.send('delete (DELETE) post data - not implemented');
});