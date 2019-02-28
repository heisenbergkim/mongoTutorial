const mongoose = require("mongoose");

const { Schema } = mongoose;

const Post = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: new Date()
  }
});

// module.exports = mongoose.model("Post", Post, "custom_book_collection");
module.exports = mongoose.model("Post", Post);
