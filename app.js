var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const { promisify } = require("util");
var logger = require("morgan");

var csurf = require("csurf");
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("baza.db");
const db_run = (db) => promisify(db.run.bind(db));
const get = (db) => promisify(db.get.bind(db));
const all = (db) => promisify(db.all.bind(db));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var newEntriesRouter = require("./routes/getNewEntries");

var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use(express.static(path.join(__dirname, "public")));

const SessionStore = new SQLiteStore();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "sAn7baRbhx4",
    store: SessionStore,
    cookie: {
      maxAge: 60 * 15 * 1000, // 15 min
    },
  })
);

app.use(function (req, res, next) {
  req.db = db;
  req.get = get;
  req.db_run = db_run;
  req.all = all;
  next();
});

app.use("/", indexRouter);
app.use("/users/", usersRouter);
app.use("/users/:page_num", usersRouter);
app.use("/getNewEntries", newEntriesRouter);

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
