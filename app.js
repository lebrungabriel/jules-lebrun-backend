require("dotenv").config();
require("./models/connection");
var express = require("express");
const path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const cors = require("cors");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;