require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")

const Farm = require("./models/Farm")
const Verkooppunt = require("./models/Verkooppunt")
const boerenData = require("./static/data/boeren.json")

const app = express()
function normalizeFarmName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
}

const boerenDataByName = new Map(
  boerenData.map(boer => [normalizeFarmName(boer.name), boer])
)

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

  const farms = (await Farm.find().lean()).map(farm => {
    const jsonFarm =
      boerenDataByName.get(normalizeFarmName(farm.name)) ||
      boerenData.find(boer =>
        Math.abs(Number(boer.lat) - Number(farm.lat)) < 0.00001 &&
        Math.abs(Number(boer.lng) - Number(farm.lng)) < 0.00001
      )
    const hasMedia =
      Array.isArray(farm.media) &&
      farm.media.some(item =>
        typeof item?.src === "string" && item.src.trim()
      )

    const jsonMedia =
      jsonFarm?.media ||
      jsonFarm?.images ||
      jsonFarm?.afbeeldingen ||
      (jsonFarm?.image ? [{ src: jsonFarm.image }] : undefined)

    if (!hasMedia && jsonMedia) {
      return {
        ...farm,
        media: jsonMedia
      }
    }

    return farm
  })

  const verkooppunten = await Verkooppunt.find()

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

app.get("/evenementen", (req, res) => {
  res.render("evenementen")
})

app.get("/kies-oeverpagina", (req, res) => {
  res.render("kies-oeverpagina")
})

app.get("/kies-oeverbedrijven", (req, res) => {
  res.render("kies-oeverbedrijven")
})

app.get("/betaalpagina", (req, res) => {
  res.render("betaalpagina")
})

app.get("/bedankt", (req, res) => {
  res.render("bedankt")
})

app.get("/bedrijven", (req, res) => {
  res.render("bedrijven")
})

app.listen(process.env.PORT, () => {
  console.log("Server running")
})
