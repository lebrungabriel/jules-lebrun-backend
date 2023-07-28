var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");
const Image = require("../models/images");

router.post("/upload", (req, res) => {
  const newImageUrl = new Image({
    url: req.body.url,
    public_id: req.body.public_id,
  });
  newImageUrl.save().then((newDoc) => {
    res.json({ image: newDoc });
    console.log("IMAGE URL RESPONSE AFTER SAVING NEWDOC", newDoc);
  });
});

router.get("/images", (req, res) => {
  Image.find({}).then((images) => {
    if (images) {
      res.json({ images });
    }
  });
});

router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log("ID ON PARAMETER", id);

  try {
    const image = await Image.findOne({ _id: id });
    if (!image) {
      return res.json({ message: "Image not found" });
    }
    const imageId = image.public_id;
    await cloudinary.uploader.destroy(imageId);

    await image.remove();

    const images = await Image.find({});
    console.log("images backend", images);

    res.json({ message: "Image deleted successfully", images });
  } catch (error) {
    res.json({ message: "Error deleting image" });
  }
});

module.exports = router;
