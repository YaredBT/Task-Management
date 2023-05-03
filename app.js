const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const Task = require("./models/Task");

const app = express();

// passport config
require("./config/passport")(passport);

// DB Config
const dbURI = require("./config/keys").MongoURI;

// Connect to Mongo
mongoose
  .connect(dbURI)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Body parser
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use((req, res) => {
  res.status(404).render("404");
});

// port number
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server listening on port number ${3000}`);
});
