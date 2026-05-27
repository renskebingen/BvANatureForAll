require("dotenv").config();

const mongoose = require("mongoose");

const Farm = require("./models/Farm");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    await Farm.deleteMany();

    await Farm.create([
      {
        name: "Mts. Van Blaaderen",
        description: "Boerderij van Remco van Blaaderen aan de Ringdijk BP 28 in Amstelveen",
        type: "boerderij",
        lat: 52.251477,
        lng: 4.858878
      },
      {
        name: "Boerderij Cornelly",
        description: "Boerderij van Cor Koster aan de Bovenkerkerweg 130 in Amstelveen",
        type: "boerderij",
        lat: 52.256064,
        lng: 4.83816
      },
      {
        name: "Weidevogelboerderij",
        description: "Boerderij van Kees Lambalk aan de Ringdijk BP 26 in Amstelveen",
        type: "boerderij",
        lat: 52.255657,
        lng: 4.864706
      },
      {
        name: "Boerderij Strandvliet",
        description: "Boerderij van Hugo den Boer aan de Binnenweg 18 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.316582,
        lng: 4.907987
      },
      {
        name: "Boerderij Polderzicht",
        description: "Boerderij van Richard Korrel aan de Polderweg 24 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.291012,
        lng: 4.89892
      },
      {
        name: "Zuivelboerderij Vrouwenakker",
        description: "Boerderij van Koos Langelaan aan de Drechtdijk 90 in De Kwakel",
        type: "boerderij",
        lat: 52.229217,
        lng: 4.783886
      },
      {
        name: "Mts. Van Schaik",
        description: "Boerderij van Henk van Schaik aan de Ringdijk BP 8 in Amstelveen",
        type: "boerderij",
        lat: 52.275476,
        lng: 4.878561
      },
      {
        name: "Melkveebedrijf Stam",
        description: "Boerderij van Gerard Stam aan de Binnenweg 16 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.313678,
        lng: 4.906846
      },
      {
        name: "Mts. Timmer",
        description: "Boerderij van Gerard en Bas Timmer aan de Rondehoep Oost 7 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.284903,
        lng: 4.919695
      },
      {
        name: "Mts. Snelderwaard",
        description: "Boerderij van John Snelderwaard aan de Bovenkerkerweg 114 in Amstelveen",
        type: "boerderij",
        lat: 52.261705,
        lng: 4.840875
      },
      {
        name: "Worners (Amstelpracht)",
        description: "Boerderij van Gerrit Worners aan de Amstelweg 1 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.283636,
        lng: 4.932934
      },
      {
        name: "Boerderij Hoeksjan",
        description: "Boerderij van Henk Langeveld aan de Bovenkerkerweg 112 in Amstelveen",
        type: "boerderij",
        lat: 52.262924,
        lng: 4.840938
      },
      {
        name: "Mts. Pouw",
        description: "Boerderij van Ton Pouw aan de Holendrechterweg 64 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.278696,
        lng: 4.95508
      },
      {
        name: "Mts. Hogenhout",
        description: "Boerderij van Cees Hogenhout aan de Korte Dwarsweg 8 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.303733,
        lng: 4.925852
      },
      {
        name: "Melkveebedrijf Roos",
        description: "Boerderij van Peter Roos aan de Waver 40 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.259035,
        lng: 4.918333
      },
      {
        name: "Poldersport",
        description: "Boerderij van Albert Blommestijn aan de Boterdijk 91 in De Kwakel",
        type: "boerderij",
        lat: 52.239487,
        lng: 4.80655
      },
      {
        name: "De Grazige Weide",
        description: "Boerderij van Vincent Post aan de Rondehoep West 70 in Ouderkerk a/d Amstel",
        type: "boerderij",
        lat: 52.256012,
        lng: 4.872754
      },
      {
        name: "Mts. Korrel",
        description: "Boerderij van Wes Korrel aan de Rondehoep West 46A in Ouderker a/d Amstel",
        type: "boerderij",
        lat: 52.27909,
        lng: 4.880113
      }
    ]);

    console.log("Seed complete");

    process.exit();

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
