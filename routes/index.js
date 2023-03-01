var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");
const Image = require("../models/images");

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (!resultMove) {
    const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    fs.unlinkSync(photoPath);
    const newImage = new Image({
      url: resultCloudinary.secure_url,
      public_id: resultCloudinary.public_id,
    });
    newImage.save().then((newDoc) => {
      res.json({ result: true, image: newDoc });
    });
  } else {
    res.json({ result: false, error: resultMove });
  }
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

  try {
    const image = await Image.findById(id);
    if (!image) {
      return res.json({ message: "Image not found" });
    }
    const imageId = image.public_id;
    await cloudinary.uploader.destroy(imageId);

    await image.remove();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.json({ message: "Error deleting image" });
  }
});

module.exports = router;
