require("dotenv").config();
const bcrypt = require("bcrypt");

const salt = parseInt(process.env.SALT,10);

// generate hash password
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// compare password
const comparePassword = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};

module.exports = { hashPassword, comparePassword };