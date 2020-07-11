var express = require("express");
var router = express.Router();
var User = require("../models/user");
const path = require("path");
const app = express();
// Multer
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
// Multer end
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// GET route for reading data
router.get("/", function (req, res, next) {
  return res.sendFile(path.join(__dirname + "/login"));
});

//READ THE IMAGE UPLOAD FOLDER
router.use(express.static("public"));

//POST route for updating data
router.post("/", function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error("Passwords do not match.");
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (
    req.body.email &&
    req.body.firstname &&
    req.body.lastname &&
    req.body.password &&
    req.body.passwordConf
  ) {
    var userData = {
      email: req.body.email,
      fullname: req.body.firstname + " " + req.body.lastname,
      password: req.body.password,
    };

    //NEW USER REGISTRATION
    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect("/complete-profile");
      }
    });
    //IF ALREADY REGISTERED
  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (
      error,
      user,
    ) {
      if (error || !user) {
        var err = new Error("Wrong email or password.");
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        //REDIRECTS TO PROFILE OF REGISTERED USER
        return res.redirect("/complete-profile");
      }
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

// MULTER START
// Mongo URI
const mongoURI =
  "mongodb+srv://Marjo:boothbaynightmare@remote-doc-otc5a.mongodb.net/Rem_D?retryWrites=true&w=majority";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Init gfs
let gfs;

conn.once("open", () => {
  // Save in Atlas
  gfs = Grid(conn.db, mongoose.mongo);
  const uploadsCollection = gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          // Id of user that is logged in
          metadata: req.session.userId,
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// GET route after login, verify if user logged in
router.get("/complete-profile", function (req, res, next) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        // Render pug template
        // Pass user(the collection name) as an option
        res.render("pleaseWork.pug", { user });
        console.log(user.fullname);
      }
    }
  });
});

router.post("/upload", upload.single("file"), (req, res) => {
  // Note: Allows duplicates
  res.send("<h1>U did it!</h1>");
});

// GET for logout
router.get("/logout", function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

module.exports = router;
