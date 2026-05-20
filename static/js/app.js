/* -----------------------------
   MAP
------------------------------*/
const map = L.map('map', {
  zoomControl: false
}).setView([52.28, 4.90], 12)

L.control.zoom({
  position: 'topright'
}).addTo(map)


/* -----------------------------
   TILE LAYER
------------------------------*/
L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; OpenStreetMap & Carto'
  }
).addTo(map)


/* -----------------------------
   DARK OVERLAY
------------------------------*/
L.rectangle(
  [
    [-90, -180],
    [90, 180]
  ],
  {
    color: 'transparent',
    fillColor: 'green',
    fillOpacity: 0.1,
    interactive: false
  }
).addTo(map)


/* -----------------------------
   POLYGON GROUPS
------------------------------*/
const allPolygons = L.featureGroup().addTo(map)
const amstellandGroup = L.featureGroup().addTo(map)


/* -----------------------------
   LOAD POLYGONS
------------------------------*/
function loadPolygon(url, style, group = allPolygons) {

  fetch(url)
    .then(res => res.json())
    .then(data => {

      L.geoJSON(data, {

        style,

        interactive: false

      }).addTo(group)

    })
    .catch(err => console.error(url, err))

}


/* -----------------------------
   RONDE HOEP
------------------------------*/
loadPolygon(
  '/poldergebieden/rondehoep.geojson',
  {
    color: 'green',
    weight: 3,
    fillColor: '#51af4c',
    fillOpacity: 0.2
  }
)


/* -----------------------------
   BOVENKERKERPOLDER
------------------------------*/
loadPolygon(
  '/poldergebieden/bovenkerkerpolder.geojson',
  {
    color: 'blue',
    weight: 3,
    fillColor: '#4f8cff',
    fillOpacity: 0.2
  }
)


/* -----------------------------
   MIDDENPOLDER
------------------------------*/
loadPolygon(
  '/poldergebieden/middenpolder.geojson',
  {
    color: 'orange',
    weight: 3,
    fillColor: '#ff9800',
    fillOpacity: 0.2
  }
)


/* -----------------------------
   AMSTELLAND
------------------------------*/
loadPolygon(
  '/amstelland/amstelland.geojson',
  {
    color: '#7b1fa2',
    weight: 4,
    fillColor: '#ba68c8',
    fillOpacity: 0.15
  },
  amstellandGroup
)

/* -----------------------------
   HEATMAP (DUMMY DATA)
------------------------------*/
const fallbackHeatData = [
  [52.292, 4.914, 0.9],
  [52.287, 4.902, 0.8],
  [52.281, 4.925, 0.7],
  [52.274, 4.893, 0.75],
  [52.269, 4.914, 0.6],
  [52.298, 4.885, 0.55],
  [52.304, 4.931, 0.5],
  [52.259, 4.901, 0.65]
]

const LIVE_HEATMAP_REFRESH_MS = 30000
let currentHeatData = fallbackHeatData

const heatLayer = L.heatLayer(currentHeatData, {
  radius: 30,
  blur: 22,
  maxZoom: 16,
  minOpacity: 0.35,
  gradient: {
    0.2: '#8bc34a',
    0.4: '#ffeb3b',
    0.7: '#ff9800',
    1.0: '#e53935'
  }
})

async function loadLiveHeatmapData() {
  try {
    const response = await fetch('/api/heatmap')

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const payload = await response.json()

    if (Array.isArray(payload.points)) {
      currentHeatData = payload.points
      heatLayer.setLatLngs(currentHeatData)
    }
  } catch (error) {
    console.error('Kon live heatmap data niet laden:', error)
    currentHeatData = fallbackHeatData
    heatLayer.setLatLngs(currentHeatData)
  }
}


/* -----------------------------
   PANEL
------------------------------*/
const panel = document.getElementById('panel')
const closeBtn = document.getElementById('closePanel')

function openPanel(farm) {

  panel.classList.add('open')

  document.getElementById('farmTitle').innerText =
    farm.name

  document.getElementById('farmDesc').innerHTML = `
    <p>${farm.description}</p>
  `
}

closeBtn.addEventListener('click', () => {
  panel.classList.remove('open')
})


/* -----------------------------
   MARKERS
------------------------------*/
const markers = []

window.FARMS.forEach(farm => {

  const marker = L.marker([
    farm.lat,
    farm.lng
  ]).addTo(map)

  const popupContent =
    document.createElement('div')

  popupContent.innerHTML = `
    <div class="popup-content">

      <h3>${farm.name}</h3>

      <p>
        ${farm.description || ''}
      </p>

      <button class="read-more-btn">
        Lees meer
      </button>

    </div>
  `

  popupContent
    .querySelector('.read-more-btn')
    .addEventListener('click', () => {

      openPanel(farm)

      map.flyTo(
        [farm.lat, farm.lng],
        14,
        {
          duration: 1.2
        }
      )

    })

  marker.bindPopup(popupContent)

  marker.on('click', () => {

    map.flyTo(
      [farm.lat, farm.lng],
      14,
      {
        duration: 1.2
      }
    )

  })

  markers.push({
    marker,
    farm
  })

})


/* -----------------------------
   FILTER
------------------------------*/
const filter =
  document.getElementById('filter')

filter.addEventListener('change', e => {
  
  const value = e.target.value

  /* -----------------------------
     ALLE
  ------------------------------*/
  if (value === 'all') {

    /* markers tonen */
    markers.forEach(obj => {

      if (!map.hasLayer(obj.marker)) {
        obj.marker.addTo(map)
      }

    })

    /* polders tonen */
    if (!map.hasLayer(allPolygons)) {
      allPolygons.addTo(map)
    }

    /* amstelland tonen */
    if (!map.hasLayer(amstellandGroup)) {
      amstellandGroup.addTo(map)
    }

    /* heatmap tonen */
    if (!map.hasLayer(heatLayer)) {
      heatLayer.addTo(map)
    }

  }

  /* -----------------------------
     ALLEEN BOERDERIJEN
  ------------------------------*/
  if (value === 'boerderij') {

    /* markers tonen */
    markers.forEach(obj => {

      if (!map.hasLayer(obj.marker)) {
        obj.marker.addTo(map)
      }

    })

    /* polygons verbergen */
    if (map.hasLayer(allPolygons)) {
      map.removeLayer(allPolygons)
    }

    if (map.hasLayer(amstellandGroup)) {
      map.removeLayer(amstellandGroup)
    }

    /* heatmap verbergen */
    if (map.hasLayer(heatLayer)) {
      map.removeLayer(heatLayer)
    }

  }

  /* -----------------------------
     ALLEEN POLDERS
  ------------------------------*/
  if (value === 'polder') {

    /* markers verbergen */
    markers.forEach(obj => {

      if (map.hasLayer(obj.marker)) {
        map.removeLayer(obj.marker)
      }

    })

    /* alleen polders tonen */
    if (!map.hasLayer(allPolygons)) {
      allPolygons.addTo(map)
    }

    /* amstelland verbergen */
    if (map.hasLayer(amstellandGroup)) {
      map.removeLayer(amstellandGroup)
    }

    /* heatmap verbergen */
    if (map.hasLayer(heatLayer)) {
      map.removeLayer(heatLayer)
    }

  }

  /* -----------------------------
     ALLEEN AMSTELLAND
  ------------------------------*/
  if (value === 'amstelland') {

    /* markers verbergen */
    markers.forEach(obj => {

      if (map.hasLayer(obj.marker)) {
        map.removeLayer(obj.marker)
      }

    })

    /* polders verbergen */
    if (map.hasLayer(allPolygons)) {
      map.removeLayer(allPolygons)
    }

    /* amstelland tonen */
    if (!map.hasLayer(amstellandGroup)) {
      amstellandGroup.addTo(map)
    }

    /* heatmap verbergen */
    if (map.hasLayer(heatLayer)) {
      map.removeLayer(heatLayer)
    }

  }

  /* -----------------------------
     ALLEEN HEATMAP
  ------------------------------*/
  if (value === 'heatmap') {

    /* markers verbergen */
    markers.forEach(obj => {
      if (map.hasLayer(obj.marker)) {
        map.removeLayer(obj.marker)
      }
    })

    /* polders verbergen */
    if (map.hasLayer(allPolygons)) {
      map.removeLayer(allPolygons)
    }

    /* amstelland verbergen */
    if (map.hasLayer(amstellandGroup)) {
      map.removeLayer(amstellandGroup)
    }

    /* heatmap tonen */
    if (!map.hasLayer(heatLayer)) {
      heatLayer.addTo(map)
    }

  }

})

loadLiveHeatmapData()
setInterval(loadLiveHeatmapData, LIVE_HEATMAP_REFRESH_MS)

filter.dispatchEvent(new Event('change'))


/* -----------------------------
   FIX LEAFLET
------------------------------*/
setTimeout(() => {
  map.invalidateSize()
}, 200)
