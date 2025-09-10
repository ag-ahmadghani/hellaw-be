const express = require("express");
const galeryController = require("../controllers/galeryController");

const router = express.Router();

// routes
router.get("/", galeryController.getGalerys);
router.get("/:id", galeryController.getGaleryById);
router.post(
  "/",
  galeryController.upload.single("image"),
  galeryController.createGalery
);
router.put("/:id", galeryController.updateGalery);
router.delete("/:id", galeryController.deleteGalery);

module.exports = router;
