// Require controller
const userController = require("../controllers/user.controller");

// Require middleware
const validate = require("../middlewares/validator");

// Routes
function userRoutes(app) {
  // Change password
  app.get("/change-password", (req, res) => {
    const locals = {
      title: "Đổi mật khẩu",
      firstLogin: req.cookies["first-login"],
    };
    res.render("account/change-password", locals);
  });
  app.post("/change-password", userController.changePassword);

  // Get Info User
  app.post("/get-info-user", userController.getInfoUser);
  // Update CMND
  app.post("/update-cmnd", userController.updateCMND);
  // Home
  app.get("/", (req, res) => {
    const locals = { title: "Trang chủ", user: req.user };
    res.render("wallet/home", locals);
  });
}

module.exports = userRoutes;
