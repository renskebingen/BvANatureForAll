require("dotenv").config();

const mongoose = require("mongoose");

const Farm = require("./models/Farm");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    await Farm.deleteMany()

    await Farm.create([
      {
        name: "Boerderij Amsterdam",
        description: "Melkveehouderij",

        lat: 52.3676,
        lng: 4.9041
      },

      {
        name: "Boerderij Utrecht",
        description: "Biologische boerderij",

        lat: 52.0907,
        lng: 5.1214
      }
    ]);

    console.log("Seed complete")

    process.exit()
  });