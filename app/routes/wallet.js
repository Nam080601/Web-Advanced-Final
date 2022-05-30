const express = require("express");
const router = express.Router();

const walletController = require("../controllers/walletController");

router.get("/", walletController.index);
router.get("/recharge", walletController.recharge); //add /:id for user id
router.get("/withdraw", walletController.withdraw);
router.get("/transfer", walletController.transfer);
router.get("/phonecards", walletController.phonecards);
router.get("/phonecardDetails", historyController.cardDetails);
router.get("/transfer/verifyOTP", walletController.verifyOTP);

// Get history data
router.post("/history", walletController.history);

module.exports = router;
