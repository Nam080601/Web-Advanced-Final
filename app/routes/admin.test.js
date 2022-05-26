const express = require("express");
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get("/deals/:slug", adminController.dealDetail);
router.post("/users/:slug", adminController.act);
router.get("/users/:slug", adminController.userDetail);
router.get("/", adminController.index);

module.exports = router;