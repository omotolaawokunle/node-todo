const User = require("../models/user");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
async function createUser(username, password) {
  const user = await User.create({
    username,
    password: hashPassword(password),
  });
  return user;
}

async function verifyPassword(username, password, done) {
  const user = await User.findOne({ username });
  if (!user) {
    console.log("Invalid username");
    return done(null, false, { message: "Invalid username or password" });
  }
  if (!user.verifyPassword(password)) {
    console.log("Invalid password");
    return done(null, false, { message: "Invalid username or password" });
  }
  return done(null, user);
}

const hashPassword = (password) => {
  return crypto
    .pbkdf2Sync(password, process.env.HASH_SECRET, 32000, 32, "sha256")
    .toString("hex");
};

module.exports = { createUser, verifyPassword, hashPassword };
