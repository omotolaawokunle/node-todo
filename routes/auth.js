var express = require('express');
var router = express.Router();
const passport = require("passport");
const { verifyPassword } = require("../services/auth");
const { register } = require("../controllers/authController");
const LocalStrategy = require("passport-local");
const User = require("../models/user");
const { isNotAuthenticated } = require("../middlewares/authMiddleware");

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user._id.toString());
  });
});
passport.deserializeUser((id, done) => {
  process.nextTick(() => {
    User.findById(id)
      .then((user) => {
        done(null, user.toObject());
      })
      .catch((err) => {
        done(err);
      });
  });
});
passport.use(new LocalStrategy(verifyPassword));
router.get("/", isAuthenticated, function (req, res, next) {
  res.redirect("/todos");
});
router.get("/login", isNotAuthenticated, function (req, res, next) {
  console.log(req.session?.messages);
  res.render("auth/login", {
    errors: {
      message: req.session?.messages?.message || req.session?.messages,
    },
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

router.get("/register", isNotAuthenticated, function (req, res, next) {
  res.render("auth/register", {
    errors: req.session?.messages?.errors,
    username: req.session?.messages?.username,
    password: req.session?.messages?.password,
    message: req.session?.messages?.message,
  });
});

router.post("/register", register);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;