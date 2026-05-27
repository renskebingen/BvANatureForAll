require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const fs = require("fs")
const path = require("path")

const Farm = require("./models/Farm")

const app = express()

app.set("view engine", "ejs")

app.use(express.static("static"))


///////////////////////
// Database connect //
/////////////////////
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
  })

app.get("/", async (req, res) => {

  const farms = await Farm.find()
  let verkooppunten = []

  try {
    const verkooppuntenPath = path.join(
      __dirname,
      "static",
      "data",
      "verkooppunten.json"
    )

    verkooppunten = JSON.parse(
      fs.readFileSync(verkooppuntenPath, "utf8")
    )
  } catch (error) {
    console.error("Kon verkooppunten niet laden:", error)
  }

  res.render("index", {
    farms,
    verkooppunten
  })
})


///////////////////////////
// Heatmap data ophalen //
/////////////////////////
app.get("/api/heatmap", async (req, res) => {
  try {
    const farms = await Farm.find({
      lat: { $ne: null },
      lng: { $ne: null }
    })
      .select("lat lng -_id")
      .lean()

    const points = farms
      .filter(farm =>
        Number.isFinite(farm.lat) &&
        Number.isFinite(farm.lng)
      )
      .map(farm => [farm.lat, farm.lng, 1])

    res.json({
      points,
      updatedAt: new Date().toISOString()
    })
  } catch (err) {
    console.error("Heatmap API error:", err)
    res.status(500).json({
      points: [],
      error: "Unable to load heatmap data"
    })
  }
})

app.get("/oevertjekopen", (req, res) => {
  res.render("oevertjekopen")
})

app.listen(process.env.PORT, () => {
  console.log("Server running")
})
