// Require controller
const userController = require("../controllers/user.controller");

// Require middleware
const validate = require("../middlewares/validator");

// Routes
function userRoutes(app) {
  // Change password
  app.get("/change-password", (req, res) => {
    const locals = { title: "Đổi mật khẩu" };
    res.render("account/change-password", locals);
  });
  // Change password
  app.post("/change-Password", userController.changePassword);
  // Get Info User
  app.post("/get-info-user", userController.getInfoUser);
  // Update CMND
  app.post("/update-cmnd", userController.updateCMND);
  // Home
  app.get("/", (req, res) => {
    const locals = { title: "Trang chủ" };
    res.render("wallet/home.ejs", locals);
  });
}

module.exports = userRoutes;
