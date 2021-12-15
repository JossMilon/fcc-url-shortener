const mongoose = require("mongoose");

const Shorturl = mongoose.model("Shorturl", {
  original_url: String,
  short_url: {
    type: Number,
    default: 0,
  },
});

module.exports = Shorturl;
