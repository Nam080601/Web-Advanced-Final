module.exports = (req, res, next) => {
  const { current } = req.session;
  if (!current && req.path != "/login") {
    return res.redirect("/login");
  }
  if (current && req.path == "/login") {
    return res.redirect("/");
  }
  next();
};
