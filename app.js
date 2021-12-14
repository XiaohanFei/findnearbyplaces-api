const createError = require("http-errors");
const path = require("path");
const express = require("express");
const cors = require('cors');
const formidableMiddleware = require('express-formidable');
const session = require("express-session");
const logger = require("morgan");
const authControllor = require("./auth");

const usersRouter = require("./routes/users");
const actionsRouter = require("./routes/actions");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(formidableMiddleware())

app.use(cors({
  origin: "https://xiaohanfei.github.io/", // allow to server to accept request from different origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // allow session cookie from browser to pass through
}));

app.use(
  session({
    secret: "3CvOpPiWM3fkb1Tm", // randon secret
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 * 10 },
    //   store: new MongoStore({
    //     db: 'sessiondb'
    // })
  })
);


app.use(express.static(path.join(__dirname, "public")));

app.use("/", usersRouter);
// add login gard
app.use(authControllor.auth);
app.use("/", actionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
