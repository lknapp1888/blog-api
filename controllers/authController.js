const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const passport = require("passport");

const bcrypt = require("bcryptjs");

exports.signup = [
  // Validate and sanitize fields.
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lastName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("username")
    .trim()
    .isEmail()
    .withMessage("please enter a valid email address")
    .escape()
    .custom(async (value) => {
      const user = await User.findOne({ email: value }).exec();
      if (user) {
        throw new Error("E-mail already in use");
      }
    })
    .withMessage("username/email already exists"),
  body("password").trim().escape().isLength({ min: 6, max: 30 }),
  body("passwordVerify", "passwords do not match").custom((value, { req }) => {
    return value === req.body.password;
  }),

  //process request after validation and sanitation -THIS WORKS!
  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      try {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        //create user
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.username,
          password: hashedPassword,
          admin: false,
        });
        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.
          res.json({ errors: errors.array() });
        } else {
          // Data from form is valid. Save user.
          await user.save();
          res.status(200).json({
            success: true,
            message: "User creation successful",
            data: {
              userId: user._id,
              username: user.email,
              isAdmin: user.admin,
              createdAt: user.registered.toISOString(), // Format the date in ISO 8601
            },
          });
          
        }
      } catch (err) {
        return next(err);
      }
    });
  }),
];

exports.login = exports.login_post = [
  body("username")
    .trim()
    .isEmail()
    .withMessage("please enter a valid email address")
    .escape(),
  body("password").trim().escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.json({ errors: errors.array() });
    }
    next();
  }),

  passport.authenticate("local", {
    successRedirect: "/api/log-in-status",
    failureRedirect: "/api/log-in-status",
  }),
];

exports.logout = asyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      message: "User successfully logged out.",
    });
    
  });
});

exports.getLogInStatus = asyncHandler(async (req, res, next) => {
        if (req.user) {
          res.status(200).json({
            success: true,
            message: "User successfully logged in.",
            data: {
              userId: req.user._id,
              username: req.user.email,
              isAdmin: req.user.admin,
            },
          });
          
        } else {
          res.status(401).json({
            success: false,
            message: "No user logged in.",
          });
          
        }
})
