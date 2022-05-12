const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

require("dotenv").config();

const app = express();
//Require Router
const userRoutes = require("./app/routes/user.router");
const accountRoutes = require("./app/routes/account.router");

// ------------------------------------------------------------------------
app.use(cors());
app.use(logger("tiny"));
app.use(cookieParser(process.env.SIGN_COOKIE));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

//Handle Router
accountRoutes(app);
userRoutes(app);

//Handle Error
app.use((req, res) => {
  res.render("404", { title: "Error", error: " 404 Error" });
});
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
