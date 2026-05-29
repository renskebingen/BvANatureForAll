const mongoose = require("mongoose")

const FarmSchema = new mongoose.Schema({

  name: String,

  description: String,

  type: String,

  address: String,

  website: String,

  storyUrl: String,

  media: [
    {
      src: String,
      alt: String
    }
  ],

  lat: Number,

  lng: Number

});

module.exports =
  mongoose.model("Farm", FarmSchema)
