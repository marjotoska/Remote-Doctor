const express = require("express");
const multer = require("multer");
const upload = multer({ dest: __dirname + "/uploads/images" });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static("Upload-img"));

app.post("/upload", upload.single("photo"), (req, res) => {
  if (req.file) {
    res.json(req.file);
  } else throw "error";
});

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
