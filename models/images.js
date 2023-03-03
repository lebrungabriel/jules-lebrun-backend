const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: String,
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
