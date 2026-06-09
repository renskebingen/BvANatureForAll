const mongoose = require("mongoose")

const VerkooppuntSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  lat: Number,
  lng: Number,
  image: String
})

module.exports =
  mongoose.model("Verkooppunt", VerkooppuntSchema)
