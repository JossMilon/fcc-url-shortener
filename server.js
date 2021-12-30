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

// Regexp
const validUrlRegexp =
  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

// Importing shorturl model
const Shorturl = require("./models/Shorturl");
const { count } = require("./models/Shorturl");

//Main route
app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/shorturl/:short_url", async function (req, res) {
  try {
    const shortUrlRequested = await Shorturl.findOne({
      short_url: req.params.short_url,
    });
    if (shortUrlRequested) {
      res.redirect(shortUrlRequested.original_url);
    } else {
      res.status(400).json({ message: "Short URL doesn't exist" });
    }
  } catch {
    res.status(400).json({ error: error.message });
  }
});

//Post shorturl
app.post("/api/shorturl", async (req, res) => {
  try {
    const isUrlAlreadyThere = await Shorturl.findOne({
      original_url: req.fields.url,
    });
    if (isUrlAlreadyThere) {
      res.status(200).json({ error: "url already shortened" });
    } else if (!validUrlRegexp.test(req.fields.url)) {
      res.status(200).json({ error: "invalid url" });
    } else {
      const orderedUrls = await Shorturl.find().sort({ short_url: "desc" });
      const counter = orderedUrls.length !== 0 ? orderedUrls[0].short_url : 0;
      const newShorturl = new Shorturl({
        original_url: req.fields.url,
        short_url: counter + 1,
      });
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
