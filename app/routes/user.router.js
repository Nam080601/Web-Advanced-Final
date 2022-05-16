//Require controller
const userController = require("../controllers/user.controller");

//Require middleware
const validate = require("../middlewares/validator");
const auth = require("../middlewares/auth");

// ------------------------------------------------------------------------
//Change password
function userRoutes(app) {
  // Middlewares
  app.use(auth.tokenAuth);

  app.get("/change-password", (req, res) => {
    const locals = { title: "Đổi mật khẩu" };
    res.render("auth/changePassword", locals);
  });
  app.post("/change-Password", userController.changePassword);

  //Get Info User
  app.post("/get-info-user", userController.getInfoUser);

  //Update CMND
  app.post("/update-cmnd", userController.updateCMND);

  //home
  app.get("/", (req, res) => {
    const locals = { title: "Trang chủ" };
    res.render("home", locals);
  });
  app.get("/test", userController.test);
}

module.exports = userRoutes;
