const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: String,
    public_id: String,
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
