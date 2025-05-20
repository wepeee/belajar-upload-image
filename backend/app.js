const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/belajar-upload-image", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema
const Image = mongoose.model(
  "Image",
  new mongoose.Schema({
    filename: String,
    url: String,
  })
);

// Upload folder setup
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = path.join(__dirname, "uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
app.post("/upload", upload.single("file"), async (req, res) => {
  const url = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  const image = await Image.create({ filename: req.file.filename, url });
  res.json(image);
});

app.get("/images", async (req, res) => {
  const images = await Image.find().sort({ _id: -1 });
  res.json(images);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
