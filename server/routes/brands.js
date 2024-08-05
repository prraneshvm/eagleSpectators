const express = require("express");
const router = express.Router();
const brandsController = require("../controller/brands");
const multer = require("multer");
const { loginCheck } = require("../middleware/auth");

// Image Upload setting
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/brands");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/all-brands", brandsController.getAllBrands);
router.post(
  "/add-brands",
  loginCheck,
  upload.single("cImage"),
  brandsController.postAddBrands
);
router.post("/edit-brands", loginCheck, brandsController.postEditBrands);
router.post(
  "/delete-brands",
  loginCheck,
  brandsController.getAllBrands
);

module.exports = router;
