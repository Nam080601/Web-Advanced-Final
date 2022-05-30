const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.post("/deals/:username/:id", adminController.actD);
router.get("/deals/:id", adminController.dealDetail);
router.post("/users/:slug", adminController.act);
router.get("/users/:slug", adminController.userDetail);
router.get("/", adminController.index);

module.exports = router;