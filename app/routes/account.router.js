//Require controller
const accountController = require("../controllers/account.controller");

// Auth
const auth = require("../middlewares/auth");

// ------------------------------------------------------------------------
function accountRoutes(app) {
  //Register
  app.get("/register", auth.loginAuth, (req, res) => {
    const locals = { title: "Đăng ký" };
    res.render("account/register", locals);
  });
  app.post("/register", accountController.register);

  //Login
  app.get("/login", auth.loginAuth, (req, res) => {
    const locals = { title: "Đăng nhập" };
    res.render("account/login", locals);
  });
  app.post("/login", accountController.login);

  //Logout
  app.get("/logout", accountController.logout);

  //Reset password
  app.get("/forgot-password", auth.loginAuth, (req, res) => {
    const locals = { title: "Khôi phục mật khẩu" };
    res.render("account/forgotpassword", locals);
  });
  app.post("/forgot-password", accountController.forgotPassword);
  app.post("/reset-password/:token", accountController.resetPassword);
}

module.exports = accountRoutes;
