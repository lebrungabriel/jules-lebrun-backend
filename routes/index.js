var express = require("express");
var router = express.Router();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const uniqid = require("uniqid");
const Image = require("../models/images");

// router.post("/upload", async (req, res) => {
//   const photoPath = `./tmp/${uniqid()}.jpg`;
//   const resultMove = await req.files.photoFromFront.mv(photoPath);

//   if (!resultMove) {
//     const resultCloudinary = await cloudinary.uploader.upload(photoPath);
//     fs.unlinkSync(photoPath);
//     const newImage = new Image({
//       url: resultCloudinary.secure_url,
//       public_id: resultCloudinary.public_id,
//     });
//     newImage.save().then((newDoc) => {
//       res.json({ result: true, image: newDoc });
//     });
//   } else {
//     res.json({ result: false, error: resultMove });
//   }
// });

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
