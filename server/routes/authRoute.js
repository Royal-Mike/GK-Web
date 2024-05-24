const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5000/";

router.get("/logout", (req, res) => {
    res.clearCookie("token");  // Clear the token cookie
    res.redirect(CLIENT_URL);
});


module.exports = router;

  
