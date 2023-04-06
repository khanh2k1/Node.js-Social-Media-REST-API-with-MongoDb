const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { findOne } = require("../models/User.model");
// register
router.post("/register", async (req, res) => {
  // check duplicate
  User.find({ username: req.body.username }).count(async (err, count) => {
    try {
      if (count === 0) {
        // generating new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        });

        await user.save();

        res.status(200).json({
          message: "Register success !",
          user: user,
        });
      } else {
        res.status(409).json({
          err: "User already exist !",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    console.log(`email= ${req.body.email}`);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.error("User not found !");
      res.status(404).json("User not found");
    } else {
      console.log(req.body.email);
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (validPassword) {
        res.status(200).json(`Login success by : ${req.body.email}`);
      } else {
        res.status(500).json(`Wrong password !`);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
