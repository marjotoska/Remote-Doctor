var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

const PORT = process.env.PORT || 8080; // Step 1

//connect to MongoDB
mongoose.connect(
  "mongodb+srv://Marjo:boothbaynightmare@remote-doc-otc5a.mongodb.net/Rem_D?retryWrites=true&w=majority" ||
    "mongodb://localhost/testForAuth",
  { useNewUrlParser: true, useUnifiedTopology: true },
);
var db = mongoose.connection;

//Test if server is connected to db
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

//handle mongo error
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(
  session({
    resave: false,
    secret: "work hard",
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  }),
);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template
app.use(express.static(__dirname + "/login"));

// include routes
var routes = require("./routes/router");
app.use("/", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 8080
app.listen(PORT, console.log(`Server is starting at ${PORT}`));
