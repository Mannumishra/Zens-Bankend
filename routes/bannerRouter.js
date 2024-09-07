const express = require("express");
const { createBanner, getBanner, updateBanner, deleteBanner, getSingleBanner } = require("../controllers/bannerControllar");
const upload = require("../middleware/multer");

const bannerRouter = express.Router();

bannerRouter.post("/banner", upload.single("image"), createBanner);
bannerRouter.get("/banner", getBanner);
bannerRouter.get("/banner/:id", getSingleBanner);
bannerRouter.patch("/banner/:id", upload.single("image"), updateBanner);
bannerRouter.delete("/banner/:id", deleteBanner);

module.exports = bannerRouter;
