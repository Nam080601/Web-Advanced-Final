const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

// router.get("/:slug", adminController.profile);
router.get("/", adminController.index);

module.exports = router;