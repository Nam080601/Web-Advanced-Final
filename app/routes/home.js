const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const locals = { title: "Home" };
  res.render("login", locals);
});

module.exports = router;
