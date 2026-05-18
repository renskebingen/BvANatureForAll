const map = L.map('map').setView([52.1326, 5.2913], 7);

/* -----------------------------
   TILE LAYER
------------------------------*/
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; OpenStreetMap & Carto'
  }
).addTo(map);


/* -----------------------------
   POLYGONS (velden)
------------------------------*/
L.polygon([
  [52.37, 4.90],
  [52.38, 4.91],
  [52.36, 4.93],
  [52.35, 4.89]
], {
  color: 'green',
  fillColor: 'green',
  fillOpacity: 0.4
}).addTo(map);


L.polygon([
  [52.365, 4.905],
  [52.375, 4.925],
  [52.355, 4.94],
  [52.345, 4.91]
], {
  color: 'orange',
  fillColor: 'orange',
  fillOpacity: 0.4
}).addTo(map);


/* -----------------------------
   RIVER (GeoJSON)
------------------------------*/
const riverGeoJSON = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [4.880, 52.385],
      [4.890, 52.382],
      [4.900, 52.380],
      [4.910, 52.378],
      [4.920, 52.375],
      [4.930, 52.372],
      [4.940, 52.370]
    ]
  }
};

L.geoJSON(riverGeoJSON, {
  style: () => ({
    color: "#1e88e5",
    weight: 6,
    opacity: 0.8
  })
}).addTo(map);


/* -----------------------------
   OVERLAY PANEL
------------------------------*/
const panel = document.getElementById("panel");
const closeBtn = document.getElementById("closePanel");

function openPanel(farm) {

  panel.classList.add("open");

  document.getElementById("farmTitle").innerText = farm.name;

  document.getElementById("farmDesc").innerHTML = `
    <p>${farm.description}</p>
    <hr>
    <p><b>Type:</b> ${farm.type || "onbekend"}</p>
    <p><b>Locatie:</b> ${farm.lat}, ${farm.lng}</p>
  `;
}

closeBtn.addEventListener("click", () => {
  panel.classList.remove("open");
});


/* -----------------------------
   MARKERS
------------------------------*/
const markers = [];

window.FARMS.forEach(farm => {

  const marker = L.marker([farm.lat, farm.lng]).addTo(map);

  marker.on("click", () => {

    openPanel(farm);

    map.flyTo([farm.lat, farm.lng], 14, {
      duration: 1.2
    });

  });

  markers.push({ marker, farm });
});


/* -----------------------------
   FILTER
------------------------------*/
const filter = document.getElementById("filter");

filter.addEventListener("change", (e) => {

  const value = e.target.value;

  markers.forEach(obj => {

    const show =
      value === "all" || obj.farm.type === value;

    if (show) {
      obj.marker.addTo(map);
    } else {
      map.removeLayer(obj.marker);
    }

  });

});


/* -----------------------------
   FIX LEAFLET RENDER BUG
------------------------------*/
setTimeout(() => {
  map.invalidateSize();
}, 200);