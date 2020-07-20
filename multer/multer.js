const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//uses static path of public folder (serves html,css,js or any file inside the folder)
app.use(express.static("public"));

app.get("/complete-profile", function (req, res) {
  //specifies absolute path for file(the html in my case)
  res.render("pleaseWork.pug");
});

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
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
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
        //save as hex string
        // const filename = buf.toString("hex") + path.extname(file.originalname);
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// @route GET /
// @desc Loads form
app.get("/complete-profile", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("pleaseWork.pug", { files: false });
    } else {
      files.map((file) => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/jpg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("pleaseWork.pug", { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
app.post("/upload", upload.single("file"), (req, res) => {
  // Note: Allows duplicates
  res.send("<h1>U did it!</h1>");
});

// @route GET /files
// @desc  Display all files in JSON
app.get("/files", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    // Check if image
    if (
      file.contentType === "image/jpeg" ||
      file.contentType === "image/png" ||
      file.contentType === "image/jpg"
    ) {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});
