const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const login = require("./app/routes/login");
const logout = require("./app/routes/logout");
const admin = require("./app/routes/admin");
const user = require("./app/routes/user");

const auth = require("./app/middlewares/auth");
const getResourceId = require("./app/middlewares/resourceId");

const app = express();

require("dotenv").config();

// View
app.set("layout", "layouts/main");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/app/views"));

// Middleware
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressLayouts);
// app.use(getResourceId);
// app.use(auth);

// Routes
app.use("/user", user);
app.use("/login", login);
app.use("/logout", logout);
app.use("/admin", admin);

app.get("/", (req, res) => {
    const locals = {
        title: "Home",
    };
    res.render("Home", locals);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// Connect database and run server
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(process.env.PORT);
        console.log(`Server running at port ${process.env.PORT}`);
    })
    .catch((err) => {
        console.log(err);
    });