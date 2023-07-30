#! /usr/bin/env node

const bcrypt = require('bcryptjs')

console.log(
    'This script populates some test users, posts and comments. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const User = require('./models/user');
  const Post = require('./models/post');
  const Comment = require('./models/comment');
  
  const users = [];
  const comments = [];
  const posts = [];
  
  const mongoose = require("mongoose");
const { findByIdAndUpdate } = require('./models/post');
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    // await createUsers();
    await createPosts();
    await createComments();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // item[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.

  async function userCreate(
    index,
    firstName,
    lastName,
    email,
    password,
    admin
  ) {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          admin
      })
      await user.save();
      users[index] = user;
      console.log(`added user: ${user.fullName}`)
      } catch (error) {
        console.log('bcrypt failed')
      }
    });

  }
  
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
      userCreate(0, 'Lewis', 'K', 'lewis@email.com', 'passwordencrypted', true),
      userCreate(1, 'Kolo', 'Toure', 'kolo@email.com', 'passwordencrypted', false),
  ]);
  }
  
  async function postCreate(
    index,
    title,
    text,
    author,
  ) {
    const post = new Post({
        title,
        text,
        author
    })
    await post.save();
    posts[index] = post;
    console.log(`Added post: ${post.text}`);
  }
  
  async function createPosts() {
    const user = await User.findOne({firstName: 'Lewis'}).exec();

      console.log('Adding posts:');
      await Promise.all([
            postCreate(0, 'This is post number 1', 'This is example text for post 1', user),
            postCreate(1, 'POST 2 TITLE', 'TEXT FOR POST TWO', user),
      ])
  };

  async function commentCreate(
    index,
    title,
    text,
    author,
    postId,
  ) {
    const post = await Post.findById(postId).exec();
    if (post === null) {
        console.log('error - post not found');
        return;
    }
    const comment = new Comment({
        title,
        text,    // const post = await Post.findById('64c657ad82c57dc9f539203e').exec();
        author,
        postId,
    });
    await comment.save();
    await Post.findByIdAndUpdate(postId, {$push: {"comments": comment._id}}, {})
    comments[index] = comment;
    console.log(`Added comment: ${comment.title}`)
  };

  async function createComments() {
    const user = await User.findOne({firstName: 'Lewis'}).exec();

    await Promise.all([
        commentCreate(0, 'Title for the post', 'Blahblah....', user, posts[0]),
        commentCreate(1, 'Title', 'Blahblah....', user, posts[0]),
        commentCreate(2, 'TITLE', 'Blahblah....', user, posts[1]),
        commentCreate(3, 'Heading', 'Blahblah....', user, posts[1]),
    ])
  }