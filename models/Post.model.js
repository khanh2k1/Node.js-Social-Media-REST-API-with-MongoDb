const mongoose = require("mongoose");
const PostScheme = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: false,
      max: 500,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
  }, 
  // update realtime
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', PostScheme)
