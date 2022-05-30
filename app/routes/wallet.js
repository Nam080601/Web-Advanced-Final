const express = require("express");
const router = express.Router();

const walletController = require('../controllers/walletController');

router.get("/", walletController.index);
router.get("/recharge", walletController.recharge); //add /:id for user id
router.get("/withdraw", walletController.withdraw);
router.get("/transfer", walletController.transfer);
router.get("/phonecards", walletController.phonecards);
router.get("/phonecardDetails", historyController.cardDetails);

// POST
router.post("/recharge", walletController.recharge_post);
router.post("/phonecards", walletController.phonecards_post);
module.exports = router;