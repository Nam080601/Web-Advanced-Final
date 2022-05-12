const jwt = require("jsonwebtoken");
const blacklistUserModel = require("../models/blacklist.model");

const tokenAuth = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) return res.redirect(303, "/login");
  jwt.verify(token, process.env.TOKEN_SECERT, (err, decoded) => {
    if (err) {
      if (err.name == "TokenExpiredError") return res.redirect(303, "/login");
      else return res.status(400).json({ code: 400, error: "Invaild Token" });
    }
    req.user = decoded;
    next();
  });
};

const loginAuth = (req, res, next) => {
  const user = req.user;
  const listRoutesUnAuth = ["/login", "/register", "/forgot-password"];
  if (!user && !listRoutesUnAuth.includes(req.path)) {
    return res.redirect(303, "/login");
  }
  if (user && listRoutesUnAuth.includes(req.path)) {
    return res.redirect(303, "/");
  }
  next();
};

module.exports = {
  tokenAuth: tokenAuth,
  loginAuth: loginAuth,
};
