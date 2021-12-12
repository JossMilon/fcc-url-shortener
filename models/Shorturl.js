const mongoose = require("mongoose");

const Shorturl = mongoose.model("Shorturl", {
  original_url: String,
  short_url: String,
});

module.exports = Shorturl;
