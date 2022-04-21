const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const locals = { title: "Login" };
  res.render("login", locals);
});

router.post("/", (req, res) => {
  const { username, password } = req.body;
  if (username == "admin" && password == "123456") {
    req.session.current = username;
    res.status(200).json({ code: 200, message: "Login successful" });
  } else {
    res.status(401).json({ code: 401, message: "Unauthorized" });
  }
});

module.exports = router;
