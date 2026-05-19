require("dotenv").config();

const mongoose = require("mongoose");

const Farm = require("./models/Farm");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    await Farm.deleteMany();

    await Farm.create([
      {
      name: "Mts. Langelaan",
      description: "Melkveehouderij aan de Drechtdijk in De Kwakel",
      type: "boerderij",

      lat: 52.229213,
      lng: 4.784314
    },
    {
      name: "A.P. Blommestijn",
      description: "Boerderij aan de Boterdijk in De Kwakel",
      type: "boerderij",

      lat: 52.239498,
      lng: 4.806452
    },
    {
      name: "Koster C.J.",
      description: "Boerderij aan de Bovenkerkerweg in Amstelveen",
      type: "boerderij",

      lat: 52.255992,
      lng: 4.838549
    },
    {
      name: "Lambalk C.J.M.",
      description: "Boerderij aan de Ringdijk Bovenkerker Polder in Amstelveen",
      type: "boerderij",

      lat: 52.255465,
      lng: 4.865615
    },
    {
      name: "VOF Snelderwaard-Van Oostveen",
      description: "Boerderij aan de Bovenkerkerweg in Amstelveen",
      type: "boerderij",

      lat: 52.262213,
      lng: 4.841000
    },
    {
      name: "Spengen Burggraaf Meijer",
      description: "Boerderij aan de Waver in Ouderkerk ad Amstel",
      type: "boerderij",

      lat: 52.25524020470693,
      lng: 4.913440000331805
    },
    {
      name: "Timmer G.J.M.",
      description: "Boerderij aan de Ronde Hoep Oost in Ouderkerk ad Amstel",
      type: "boerderij",

      lat: 52.28490864494316,
      lng: 4.919702890734106
    },
    {
      name: "Mts. Korrel",
      description: "Boerderij aan de Polderweg in Ouderkerk aan de Amstel",
      type: "boerderij",

      lat: 52.29097907200209,
      lng: 4.898930955152533
    },
    {
      name: "Boeren van Amstel",
      description: "Lokale boerenorganisatie in Ouderkerk aan de Amstel",
      type: "boerderij",

      lat: 52.32130040328525,
      lng: 4.8788275839903426
    },
    {
      name: "C. Hogenhout",
      description: "Boerderij aan de Korte Dwarsweg in Ouderkerk aan de Amstel",
      type: "boerderij",
      lat: 52.30372815149948,
      lng: 4.92555698425045
    },
    {
      name: "Stam G.",
      description: "Boerderij aan de Binnenweg in Ouderkerk aan de Amstel",
      type: "boerderij",
      lat: 52.31455426610347,
      lng: 4.906752853301086
    },
    {
      name: "VOF J.C. van Blaaderen",
      description: "Boerderij aan de Ringdijk in Amstelveen",
      type: "boerderij",
      lat: 52.251408362988485,
      lng: 4.8586447646752715
    },
    {
      name: "H. Langeveld",
      description: "Boerderij aan de Bovenkerkerweg in Amstelveen",
      type: "boerderij",
      lat: 52.26290693906177,
      lng: 4.8408213263147815
    },
    {
      name: "Firma Roos",
      description: "Boerderij aan de Waver in Ouderkerk aan de Amstel",
      type: "boerderij",
      lat: 52.268638459491335,
      lng: 4.927673155151215
    },
    {
      name: "Schaik H. van",
      description: "Boerderij aan de Ringdijk Bovenkerker Polder in Amstelveen",
      type: "boerderij",
      lat: 52.28014244417149,
      lng: 4.877623683988012
    },
    {
      name: "VOF Korrel van Beek",
      description: "Boerderij aan de Ronde Hoep West in Ouderkerk aan de Amstel",
      type: "boerderij",

      lat: 52.2792112282182,
      lng: 4.879741110971277
    },
    {
      name: "T. Pouw",
      description: "Boerderij aan de Holendrechterweg in Ouderkerk aan de Amstel",
      type: "boerderij",

      lat: 52.27915793606025,
      lng: 4.942882428168524
    },
    {
      name: "Worners G.",
      description: "Boerderij aan de Amstelweg in Ouderkerk aan de Amstel",
      type: "boerderij",

      lat: 52.28379323706609,
      lng: 4.932879753299283
    }


    ]);

    console.log("Seed complete");

    process.exit();

  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });