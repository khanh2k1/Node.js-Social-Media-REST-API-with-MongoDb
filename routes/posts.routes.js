const router = require("express").Router();

const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");

router.get("/", (req, res) => {
  res.send("HELLO WORLD COME TO POST ROUTE");
});

// create
router.post("/", async (req, res) => {
  const newPost = await PostModel(req.body);

  console.log(`newPost= ${newPost}`);

  if (newPost) {
    try {
      const savedPost = await newPost.save();
      res.status(200).json({
        message: "create a post success !",
        savedPost,
      });
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  }
});
// update
router.put("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });

      return res.status(200).json({
        message: "Update post success !",
      });
    } 
    else {
      return res.status(403).json({
        error: "You can only update your post !",
        statusCode: res.statusCode,
      });
    }
  } catch (error) {
    console.error(`error= ${error}`);
    return res.status(500).json({
      error: error
    })
  }
});
// delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne()

      return res.status(200).json({
        message: "delete post success !",
      });
    } 
    else {
      return res.status(403).json({
        error: "You can only delete your post !",
        statusCode: res.statusCode,
      });
    }
  } catch (error) {
    console.error(`error= ${error}`);
    return res.status(500).json({
      error: error
    })
  }
});
// like
router.put("/:id/like", async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post.likes.includes(res.body.userId)) {
      await post.updateOne({
        $push:{
          likes: res.body.userId
        }
      })
      return res.status(200).json({
        message: "Like post success !"
      })
    } 
    else {
      await post.updateOne({
        $pull:{
          likes: res.body.userId
        }
      })
      return res.status(200).json({
        message: "DisLike post success !"
      })
    }
  } catch (error) {
    console.error(`error= ${error}`);
    return res.status(500).json({
      error: error
    })
  }
});
// get a post 
router.get("/:id", async(req,res)=> {
  try {
    const post = await PostModel.findById(req.params.id)
    if(post.userId===req.body.userId){
      return res.status(200).json({
        message: "get post success",
        post: post
      })
    }
    else {
      return res.status(404).json({
        error: "get post fail ",
        statusCode: res.statusCode,
      });
    }
  } catch (error) {
    console.error(`error= ${error}`);
    return res.status(500).json({
      error: error
    })
  }

})
// get all post's follower that u follow
router.get("/posts", async(req,res)=> {
  try {
    const currentUser = await UserModel.findById(res.body.userId)
    const userPosts = await PostModel.find()
  } catch (error) {
    console.error(`error= ${error}`);
    return res.status(500).json({
      error: error
    })
  }

})

module.exports = router;
