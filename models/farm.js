const mongoose = require("mongoose")

const FarmSchema = new mongoose.Schema({

  name: String,

  description: String,

  lat: Number,

  lng: Number

});

module.exports =
  mongoose.model("Farm", FarmSchema)