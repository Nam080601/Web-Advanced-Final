const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  delete req.session.current;
  res.redirect(303, "/login");
});

module.exports = router;
