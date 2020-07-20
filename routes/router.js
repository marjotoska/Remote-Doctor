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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// GET route for reading data
router.get("/", function (req, res, next) {
  return res.sendFile(path.join(__dirname + "/login"));
});

//READ THE IMAGE UPLOAD FOLDER
router.use(express.static("public"));
// Assign as static to read css and js also
router.use(express.static("publicCopy"));

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
    req.body.passwordConf &&
    req.body.privilege
  ) {
    var userData = {
      email: req.body.email,
      fullname: req.body.firstname + " " + req.body.lastname,
      password: req.body.password,
      privilege: req.body.privilege,
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
  var uploadToAtlas = gfs.collection("uploads");
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
        const err = new Error("Not authorized! Go back!");
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
  res.send(
    "<h1>Image Was Uploaded on MongoDB!</h1>" +
      "<br>" +
      '<a class="btn btn-white btn-animate proceed-to-chat" type="button" href="../pre-chat">Proceed to chat</a>',
  );
});

// const uploadToAtlas = gfs.collection("uploads");

// Render preChat.pug
router.get("/pre-chat", function (req, res, next) {
  User.aggregate([
    {
      $project: {
        _id: 0,
        fullname: {
          $cond: {
            if: { $eq: ["Patient", "$privilege"] },
            then: "$$REMOVE",
            else: "$fullname",
          },
        },
        privilege: {
          $cond: {
            if: { $eq: ["Patient", "$privilege"] },
            then: "$$REMOVE",
            else: "$privilege",
          },
        },
      },
    },
  ]).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        const err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        // Read html
        res.sendFile(path.join(__dirname, "../publicCopy", "index.html"));
        console.log(user);
      }
    }
  });
});

// Render chat.pug
router.get("/chat", function (req, res, next) {
  const botName = "Remote Doctor Bot";

  // Run when client connects
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

      // Welcome current user
      socket.emit(
        "message",
        formatMessage(
          botName,
          "This is the beginning of your message history with... " + username,
        ),
      );

      // Broadcast when a user connects
      // socket.broadcast
      //   .to(user.room)
      //   .emit(
      //     "message",
      //     formatMessage(botName, `${user.username} has joined the chat`),
      //   );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit("message", formatMessage(user.username, msg));

      // Import msg model for usage
      const Msg = require("./models/msg");
      // save msg to Atlas, username & message being the same as socket
      let doc1 = new Msg({ user: user.username, msg: msg });

      doc1.save(function (err, doc) {
        if (err) return console.error(err);
        //Runs everytime a new msg is added
        console.log("Msg inserted successfully!");
      });
    });

    // Runs when client disconnects
    socket.on("disconnect", () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`),
        );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
});
// DOESNT WORK!!!!! (its to show image from db)
// ||||||||||||||||||||||||||||||||||||||||||
// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// gfs.files.findOne(
//   { filename: "pellumb-pipero-696x385-1.jpg" },
//   (err, file) => {
//     // Read output to browser
//     const readstream = gfs.createReadStream({
//       filename: "pellumb-pipero-696x385-1.jpg",
//     });
//     readstream.pipe(res);
//     console.log({ metadata: req.session.userId });
//     console.log({ filename: "" });
//   },
// );
// let p = new Promise((resolve, reject) => {
//   let metadata = connectForGFS();
//   // conn.collection("uploads.files")
//   // .findOne({ metadata: "5f096f5cc4cc201724c27185" });
//   if (metadata != null) {
//     resolve("Collection not empty!");
//     return metadata;
//   } else {
//     reject("No data!");
//   }
// });

// p.then((message, metadata) => {
//   console.log("This is in then " + message);
//   console.log(metadata);
// }).catch((message) => {
//   console.log("this is in catch" + message);
// });
// const metadata = conn.collection("uploads.files").getIndexes().then();
// console.log(metadata);

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

router.get("/find-user", function (req, res, next) {
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        const err = new Error("Not authorized! Go back!");
        err.status = 400;
        return next(err);
      } else {
        // Render pug template
        // Pass user(the collection name) as an option
        console.log(user.fullname);
      }
    }
  });
});

// var sessionId = req.session.userId;
// exports.sessioinId = sessionId;
module.exports = router;
