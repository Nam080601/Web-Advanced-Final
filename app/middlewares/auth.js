const jwt = require("jsonwebtoken");
const blacklistUserModel = require("../models/blacklist.model");

const listRoutesUnAuth = ["/login", "/register", "/forgot-password"];

const userAuth = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    if (!listRoutesUnAuth.includes(req.path)) {
      return res.redirect(303, "/login");
    }
    next();
  }
  if (token) {
    if (listRoutesUnAuth.includes(req.path)) {
      return res.redirect(303, "/");
    }
    jwt.verify(token, process.env.TOKEN_SECERT, (err, decoded) => {
      if (err) {
        return res.status(401).redirect("/login");
      }
      req.user = decoded;
      next();
    });
  }
};

module.exports = {
  userAuth: userAuth,
};
