require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_DB_URI);
app.use(cors());
app.use(formidable());
app.use("/public", express.static(`${process.cwd()}/public`));

// Importing shorturl model
const Shorturl = require("./models/Shorturl");

//Not very safe shorturl counter
let i = 0;

//Main route
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//Post shorturl
app.post("/api/shorturl", async (req, res) => {
  try {
    const isUrlAlreadyThere = await Shorturl.findOne({
      original_url: req.fields.url,
    });
    if (isUrlAlreadyThere) {
      res.status(400).json({ message: "URL already shortened" });
    } else {
      const newShorturl = new Shorturl({
        original_url: req.fields.url,
        short_url: i,
      });
      i++;
      await newShorturl.save();
      res.status(200).json({
        original_url: newShorturl.original_url,
        short_url: newShorturl.short_url,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Get shorturl
app.get("/api/shorturl/:urlId", async (req, res) => {
  try {
    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
