require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Farm = require("./models/Farm");
const Verkooppunt = require("./models/Verkooppunt");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    await Farm.deleteMany();
    await Verkooppunt.deleteMany();

    const boerenPath = path.join(
      __dirname,
      "static",
      "data",
      "boeren.json"
    );

    const boeren = JSON.parse(
      fs.readFileSync(boerenPath, "utf8")
    );

    await Farm.create(
      boeren.map(boer => ({
        name: boer.name,
        description: boer.description,
        type: boer.type || "boerderij",
        address: boer.address || boer.adres || boer.location || boer.locatie,
        website: boer.website || boer.url || boer.link,
        storyUrl: boer.storyUrl || boer.verhaalUrl || boer.fullStoryUrl,
        media: boer.media || boer.images || boer.afbeeldingen,
        lat: boer.lat,
        lng: boer.lng
      }))
    );

    const verkooppuntenPath = path.join(
      __dirname,
      "static",
      "data",
      "verkooppunten.json"
    );

    const verkooppunten = JSON.parse(
      fs.readFileSync(verkooppuntenPath, "utf8")
    );

    await Verkooppunt.create(
      verkooppunten.map(verkooppunt => ({
        name: verkooppunt.name,
        description: verkooppunt.description,
        type: "verkooppunt",
        lat: verkooppunt.lat,
        lng: verkooppunt.lng
      }))
    );

    console.log("Seed complete");

    process.exit();

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
