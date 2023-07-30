const connection = require('../config/database');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    title: {type: String, required: true, maxLength: 150, minLength: 1},
    text: {type: String, required: true, maxLength: 5000, minLength: 1},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: {type: Schema.Types.ObjectId, ref: "Post"},
    postTime: {type: Date, default: () => Date.now(), immutable: true},
});

module.exports = connection.model('Comment', CommentSchema);