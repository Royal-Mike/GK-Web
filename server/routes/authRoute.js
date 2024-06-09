require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");


const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5000/";

router.get("/logout", (req, res) => {
    res.clearCookie("token");  // Clear the token cookie
    res.redirect(CLIENT_URL);
});






///////////////////////// FACEBOOK /////////////////////////
// router.get("/facebook", passport.authenticate("facebook", {scope: 'email'}));

// router.get("/auth/facebook/callback", function (req, res, next) {
//   passport.authenticate("facebook", function (err, user, info) {
//     if (err) {
//       // Handle error
//       console.error(err);
//       return res.status(500).json({ error: "Authentication failed" });
//     }
//     if (!user) {
//       // Authentication failed
//       console.log("user: ", user);
//       console.log("info: ", info);
//       return res.redirect(CLIENT_URL + "account/login");
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         // Handle error
//         console.error(err);
//         return res.status(500).json({ error: "Login failed" });
//       }
//       const accessToken = jwt.sign(
//         { userid: user.id },
//         process.env.ACCESS_TOKEN_SECRET
//       );
//       res.cookie("token", accessToken, {
//         httpOnly: true,
//         //secure: true,
//         //maxAge: 1000000,
//         //signed: true,
//       })

//       return res.redirect(CLIENT_URL + "?token=" + accessToken);
//     });
//   })(req, res, next);
// });


module.exports = router;

  
