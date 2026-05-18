require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

const Farm = require("./models/Farm")

const app = express()

app.set("view engine", "ejs")

app.use(express.static("static"))

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
  })

app.get("/", async (req, res) => {

  const farms = await Farm.find()

  res.render("index", {
    farms
  })
})

app.listen(process.env.PORT, () => {
  console.log("Server running")
})