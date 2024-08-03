var express = require("express");
var router = express.Router();

const bcrypt = require("bcrypt");
const uid2 = require("uid2");

const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");

/* GET users listing. */
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((newDoc) => {
        res.json({
          result: true,
          token: newDoc.token,
          email: newDoc.email,
        });
        console.log(newDoc);
      });
    } else {
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.post("/signin", (req, res) => {
  console.log("helloooo world");
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        message: "User signed in successfully",
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

module.exports = router;
