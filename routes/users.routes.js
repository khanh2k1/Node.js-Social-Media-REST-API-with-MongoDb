const { route } = require("./auth.routes");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { update, findByIdAndUpdate } = require("../models/User.model");
const UserModel = require("../models/User.model");
const PostModel = require("../models/Post.model");

router.get("/", (req, res) => {
  res.send("This is user route");
});

// update user
router.put("/:id", async (req, res) => {
  // nếu người đó tự sửa thông tin chính mình thì chấp nhập,
  // còn muốn sửa tất cả của mọi người thì cần quyền admin

  // check isAdmin

  if (
    req.body.userId === req.params.id ||
    async function () {
      const user = await User.findById(req.params.id);
      if (user) {
        return user.isAdmin;
      }
    }
  ) {
    // update user if has role admin or that user
    // req.params.id khi người dùng đăng nhập thành công thì sẽ lấy id đó xem xét quyền

    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }

      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });

        return res.status(200).json("Account has been updated !");
      } catch (err) {
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json("U can update only your account !");
    }
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  // nếu người đó tự sửa thông tin chính mình thì chấp nhập,
  // còn muốn sửa tất cả của mọi người thì cần quyền admin

  // check isAdmin

  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);

      return res.status(200).json("Account has been deleted  !");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("U can delete only your account !");
  }
});

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // console.log(user)
      return res.status(200).json({
        message: "Success !",
        user,
      });
    } else {
      console.log("user is not exist");
      return res.status(404).json({
        message: "Not found",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(`err: ${err}`);
  }
});
// follow a user
// unfollow a user
router.put("/:id/follow", async (req, res) => {
  // cant follow myself
  if (req.body.userId !== req.params.id) {
    try {
      // if user exist
      const they = await User.findById(req.params.id);
      // myself
      const you = await User.findById(req.body.userId);
      if (they) {
        // if you havent followed user
        // if exist return value else return undefined
        if (await you.followings.includes(req.params.id)) {
          await you.updateOne({
            $pull: { followings: req.params.id },
          });

          await they.updateOne({
            $pull: { followers: you._id },
          });
          return res.json("U have unfollowed this user").status(200);
        } else {
          // u follow them
          await you.updateOne({ $push: { followings: req.params.id } });
          // they have u followed
          await they.updateOne({ $push: { followers: req.body.userId } });

          return res
            .status(200)
            .json(`followed this user success : ${they.username}`);
        }
      } else {
        return res.status(404).json("User not found !");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(`error ${error}`);
    }
  } else {
    return res.status(403).json("U cant follow yourself !");
  }
});

// get all follower
router.get("/:id/followers", async (req, res) => {
  // cant follow myself
  const user = await UserModel.findById(req.params.id);
  if (user) {
    try {
      const followers = await Promise.all(
        user.followers.map(async (followerId) => {
          console.log(`followerId: ${followerId}`);
          const follower = await User.findById(followerId);
          return {
            username: follower.username,
            email: follower.email,
          };
        })
      );

      return res.status(200).json(followers);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error,
      });
    }
  } else {
    console.error({
      message: "User not found !",
    });
  }
});
module.exports = router;
