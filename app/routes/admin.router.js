const adminController = require("../controllers/adminController");

function adminRoutes(app) {
  app.post("/admin/deals/:username/:id", adminController.actD);
  app.get("/admin/deals/:id", adminController.dealDetail);
  app.post("/admin/users/:slug", adminController.act);
  app.get("/admin/users/:slug", adminController.userDetail);
  app.get("/admin", adminController.index);
}

module.exports = adminRoutes;
