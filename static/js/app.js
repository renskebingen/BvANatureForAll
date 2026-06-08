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
const tiles = L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; OpenStreetMap & Carto'
  }
).addTo(map)


/* -----------------------------
   MAP FILTER
------------------------------*/
tiles.getContainer().style.filter = `
  brightness(0.95)
  contrast(1.2)
  saturate(1.4)
  hue-rotate(-6deg)
`


/* -----------------------------
   SOFT GREEN OVERLAY
------------------------------*/
L.rectangle(
  [
    [-90, -180],
    [90, 180]
  ],
  {
    color: 'transparent',
    fillColor: '#6f8f5f',
    fillOpacity: 0.12,
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
let previousPanelMapView = null

const defaultFarmMedia = [
  '/images/oevertje.jpg'
]

const fallbackFarmImages = [
  {
    name: 'Mts. Korrel',
    lat: 52.27909,
    lng: 4.880113,
    src: '/images/richardkorrel.png'
  }
]

function rememberMapViewBeforePanelFly() {
  if (!previousPanelMapView) {
    previousPanelMapView = {
      center: map.getCenter(),
      zoom: map.getZoom()
    }
  }
}

function restorePreviousPanelMapView() {
  if (previousPanelMapView) {
    map.flyTo(previousPanelMapView.center, previousPanelMapView.zoom, {
      duration: 1.2
    })

    previousPanelMapView = null
  }
}

function getFarmValue(farm, keys) {
  return keys
    .map(key => farm[key])
    .find(value => typeof value === 'string' && value.trim())
    ?.trim()
}

function normalizeLinkUrl(url) {
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('/') || url.startsWith('#')) {
    return url
  }

  return `https://${url}`
}

function normalizeImageUrl(url) {
  if (!url || /^(https?:)?\/\//i.test(url) || url.startsWith('/')) {
    return url
  }

  return `/${url.replace(/^\.\//, '').replace(/^\.\.\//, '')}`
}

function getFarmAddress(farm) {
  const directAddress = getFarmValue(farm, [
    'address',
    'adres',
    'location',
    'locatie'
  ])

  if (directAddress) {
    return directAddress
  }

  const description = farm.description || ''
  const addressMatch = description.match(/\saan de\s(.+)$/i)

  return addressMatch ? addressMatch[1] : ''
}

function getFarmUrl(farm) {
  return getFarmValue(farm, [
    'website',
    'url',
    'link'
  ])
}

function getFarmStoryUrl(farm) {
  return getFarmValue(farm, [
    'storyUrl',
    'verhaalUrl',
    'fullStoryUrl'
  ])
}

function getFarmMedia(farm) {
  const media = farm.media || farm.images || farm.afbeeldingen

  if (Array.isArray(media) && media.length) {
    return media
      .map(item => typeof item === 'string' ? { src: item } : item)
      .map(item => ({ ...item, src: normalizeImageUrl(item.src) }))
      .filter(item => item?.src)
  }

  const image = getFarmValue(farm, [
    'image',
    'afbeelding',
    'photo',
    'foto'
  ])

  if (image) {
    return [
      { src: normalizeImageUrl(image) }
    ]
  }

  const fallbackImage = fallbackFarmImages.find(item =>
    item.name === farm.name ||
    (
      Math.abs(Number(item.lat) - Number(farm.lat)) < 0.00001 &&
      Math.abs(Number(item.lng) - Number(farm.lng)) < 0.00001
    )
  )

  if (fallbackImage) {
    return [
      { src: normalizeImageUrl(fallbackImage.src) }
    ]
  }

  return []
}

function getPopupImageSrc(farm) {
  const mediaSrc = getFarmMedia(farm)[0]?.src

  if (mediaSrc) {
    return normalizeImageUrl(mediaSrc)
  }

  const image = getFarmValue(farm, [
    'image',
    'afbeelding',
    'photo',
    'foto'
  ])

  return image ? normalizeImageUrl(image) : ''
}

function renderPanelLink(linkElement, url, label) {
  if (!url) {
    linkElement.hidden = true
    linkElement.textContent = ''
    linkElement.removeAttribute('href')
    return
  }

  linkElement.hidden = false
  linkElement.href = normalizeLinkUrl(url)
  linkElement.textContent = label || url
  linkElement.target = '_blank'
  linkElement.rel = 'noopener noreferrer'
}

function openPanel(farm) {

  panel.classList.add('open')

  const farmTitle = document.getElementById('farmTitle')
  const farmDesc = document.getElementById('farmDesc')
  const farmLoc = document.getElementById('farmLoc')
  const farmLink = document.getElementById('farmLink')
  const farmStoryLink = document.getElementById('farmStoryLink')
  const farmMedia = document.getElementById('farmMedia')
  const farmMediaSection = document.getElementById('farmMediaSection')
  const farmUrl = getFarmUrl(farm)
  const storyUrl = getFarmStoryUrl(farm)
  const mediaItems = getFarmMedia(farm)

  farmTitle.textContent = farm.name || 'Onbekende boer'
  farmDesc.textContent =
    farm.about ||
    farm.over ||
    farm.description ||
    'Meer informatie over deze boer volgt binnenkort.'

  farmLoc.textContent =
    getFarmAddress(farm) ||
    'Adres volgt binnenkort'

  renderPanelLink(
    farmStoryLink,
    storyUrl,
    'Lees het hele verhaal hier'
  )

  if (farmUrl) {
    farmLink.hidden = false
    farmLink.textContent = ''

    const websiteLink = document.createElement('a')
    websiteLink.href = normalizeLinkUrl(farmUrl)
    websiteLink.textContent = farmUrl
    websiteLink.target = '_blank'
    websiteLink.rel = 'noopener noreferrer'

    farmLink.appendChild(websiteLink)
  } else {
    farmLink.hidden = true
    farmLink.textContent = ''
  }

  farmMedia.textContent = ''
  farmMediaSection.hidden = !mediaItems.length

  mediaItems.forEach((item, index) => {
    const image = document.createElement('img')
    image.src = normalizeImageUrl(item.src)
    image.alt = item.alt || `${farm.name || 'Boerderij'} media ${index + 1}`
    image.loading = 'lazy'

    farmMedia.appendChild(image)
  })
}

closeBtn.addEventListener('click', () => {
  panel.classList.remove('open')
  restorePreviousPanelMapView()
})

map.on('popupclose', restorePreviousPanelMapView)


/* -----------------------------
   MARKERS
------------------------------*/
const farmsData = JSON.parse(
  document.getElementById('farms-data')?.textContent || '[]'
)

const verkooppuntenData = JSON.parse(
  document.getElementById('verkooppunten-data')?.textContent || '[]'
)

const markers = []
const verkoopMarkers = []

const farmMarkerIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 41'%3E%3Cpath d='M12.5 0C6 0 .7 5.3 .7 11.8c0 8.9 11.8 29.2 11.8 29.2s11.8-20.3 11.8-29.2C24.3 5.3 19 0 12.5 0z' fill='%232128B8'/%3E%3Ccircle cx='12.5' cy='12' r='4.5' fill='white'/%3E%3C/svg%3E",
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const verkooppuntMarkerIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 25 41'%3E%3Cpath d='M12.5 0C6 0 .7 5.3 .7 11.8c0 8.9 11.8 29.2 11.8 29.2s11.8-20.3 11.8-29.2C24.3 5.3 19 0 12.5 0z' fill='%234E92B3'/%3E%3Ccircle cx='12.5' cy='12' r='4.5' fill='white'/%3E%3C/svg%3E",
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

farmsData.forEach(farm => {

  const marker = L.marker([
    farm.lat,
    farm.lng
  ], {
    icon: farmMarkerIcon
  }).addTo(map)

  const popupContent =
    document.createElement('div')

  const popupImageSrc = getPopupImageSrc(farm)
  const popupImageHtml = popupImageSrc
    ? `<img src="${popupImageSrc}" alt="${farm.name || 'Boerderij'}" loading="lazy" />`
    : ''

  popupContent.innerHTML = `
    <div class="popup-content">
      ${popupImageHtml}

      <div class="popup-info">
        <h3>${farm.name}</h3>

        <p>
          ${farm.description || ''}
        </p>

        <button class="read-more-btn">
          Lees meer
        </button>

        <p>${getFarmAddress(farm) || ''}</p>
      </div>

    </div>
  `

  popupContent
    .querySelector('.read-more-btn')
    .addEventListener('click', () => {
      rememberMapViewBeforePanelFly()

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
    rememberMapViewBeforePanelFly()

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

verkooppuntenData.forEach(verkooppunt => {

  const marker = L.marker([
    verkooppunt.lat,
    verkooppunt.lng
  ], {
    icon: verkooppuntMarkerIcon
  }).addTo(map)

  const popupContent =
    document.createElement('div')

  popupContent.innerHTML = `
    <div class="popup-content">

      <h3>${verkooppunt.name}</h3>

      <p>
        ${verkooppunt.description || ''}
      </p>

      <button class="read-more-btn">
        Lees meer
      </button>

    </div>
  `

  popupContent
    .querySelector('.read-more-btn')
    .addEventListener('click', () => {

      openPanel(verkooppunt)

      map.flyTo(
        [verkooppunt.lat, verkooppunt.lng],
        14,
        {
          duration: 1.2
        }
      )

    })

  marker.bindPopup(popupContent)

  marker.on('click', () => {

    map.flyTo(
      [verkooppunt.lat, verkooppunt.lng],
      14,
      {
        duration: 1.2
      }
    )

  })

  verkoopMarkers.push({
    marker,
    verkooppunt
  })

})


/* -----------------------------
   FILTER LAGEN
------------------------------*/

const layerBoerderij =
  document.getElementById('layerBoerderij')

const layerVerkooppunten =
  document.getElementById('layerVerkooppunten')

const layerPolder =
  document.getElementById('layerPolder')

const layerAmstelland =
  document.getElementById('layerAmstelland')

const layerHeatmap =
  document.getElementById('layerHeatmap')

const layerData =
  document.getElementById('layerData')

const dataDashboard =
  document.querySelector('.dataDashboard')

const algemeneDataWidget =
  document.querySelector('.algemeneData')

const paginaLink =
  document.querySelector('.paginaLink')

  
/* -----------------------------
   Data flyTo
------------------------------*/

let wasDataChecked = layerData.checked
let previousLayerState = null
let previousMapView = null

const mapLayerInputs = {
  boerderij: layerBoerderij,
  verkooppunten: layerVerkooppunten,
  polder: layerPolder,
  amstelland: layerAmstelland,
  heatmap: layerHeatmap
}

function saveLayerState() {
  return Object.fromEntries(
    Object.entries(mapLayerInputs)
      .map(([key, input]) => [key, input.checked])
  )
}

function applyLayerState(state) {
  Object.entries(mapLayerInputs).forEach(([key, input]) => {
    if (typeof state[key] === 'boolean') {
      input.checked = state[key]
    }
  })
}

function onMapLayerChange(layerKey) {
  if (layerData.checked && previousLayerState) {
    previousLayerState[layerKey] = mapLayerInputs[layerKey].checked
  }

  updateLayers()
}

function flyToDataArea() {
  const bounds = L.latLngBounds([])

  markers.forEach(obj => {
    bounds.extend(obj.marker.getLatLng())
  })

  if (allPolygons.getLayers().length > 0) {
    const polderBounds = allPolygons.getBounds()

    if (polderBounds.isValid()) {
      bounds.extend(polderBounds)
    }
  }

  if (amstellandGroup.getLayers().length > 0) {
    const amstellandBounds = amstellandGroup.getBounds()

    if (amstellandBounds.isValid()) {
      bounds.extend(amstellandBounds)
    }
  }

  if (bounds.isValid()) {
    map.flyToBounds(bounds, {
      paddingTopLeft: [40, 40],
      paddingBottomRight: [420, 260],
      duration: 1.2
    })
  }
}

/* -----------------------------
   UPDATE MAP
------------------------------*/
function updateLayers() {
  const shouldFlyToDataArea =
    layerData.checked && !wasDataChecked

  /* -----------------------------
     BOERDERIJEN
  ------------------------------*/
  if (layerBoerderij.checked) {

    markers.forEach(obj => {

      if (!map.hasLayer(obj.marker)) {
        obj.marker.addTo(map)
      }

    })

  } else {

    markers.forEach(obj => {

      if (map.hasLayer(obj.marker)) {
        map.removeLayer(obj.marker)
      }

    })

  }

  /* -----------------------------
     VERKOOPPUNTEN
  ------------------------------*/
  if (layerVerkooppunten.checked) {

    verkoopMarkers.forEach(obj => {

      if (!map.hasLayer(obj.marker)) {
        obj.marker.addTo(map)
      }

    })

  } else {

    verkoopMarkers.forEach(obj => {

      if (map.hasLayer(obj.marker)) {
        map.removeLayer(obj.marker)
      }

    })

  }

  /* -----------------------------
     POLDERS
  ------------------------------*/
  if (layerPolder.checked) {

    if (!map.hasLayer(allPolygons)) {
      allPolygons.addTo(map)
    }

  } else {

    if (map.hasLayer(allPolygons)) {
      map.removeLayer(allPolygons)
    }

  }

  /* -----------------------------
     AMSTELLAND
  ------------------------------*/
  if (layerAmstelland.checked) {

    if (!map.hasLayer(amstellandGroup)) {
      amstellandGroup.addTo(map)
    }

  } else {

    if (map.hasLayer(amstellandGroup)) {
      map.removeLayer(amstellandGroup)
    }

  }

  /* -----------------------------
     HEATMAP
  ------------------------------*/
  if (layerHeatmap.checked) {

    if (!map.hasLayer(heatLayer)) {
      heatLayer.addTo(map)
    }

  } else {

    if (map.hasLayer(heatLayer)) {
      map.removeLayer(heatLayer)
    }

  }



  /* -----------------------------
     Data
  ------------------------------*/
  if (dataDashboard) {
    dataDashboard.style.display =
      layerData.checked ? 'block' : 'none'
  }

  if (algemeneDataWidget) {
    algemeneDataWidget.style.display =
      layerData.checked ? 'none' : ''
  }

  if (paginaLink) {
    paginaLink.style.display =
      layerData.checked ? 'none' : 'flex'
  }

  if (shouldFlyToDataArea) {
    flyToDataArea()
  }

  wasDataChecked = layerData.checked

}

/* -----------------------------
   EVENT LISTENERS
------------------------------*/
layerBoerderij.addEventListener('change', () => onMapLayerChange('boerderij'))
layerVerkooppunten.addEventListener('change', () => onMapLayerChange('verkooppunten'))
layerPolder.addEventListener('change', () => onMapLayerChange('polder'))
layerAmstelland.addEventListener('change', () => onMapLayerChange('amstelland'))
layerHeatmap.addEventListener('change', () => onMapLayerChange('heatmap'))
layerData.addEventListener('change', () => {
  if (layerData.checked) {
    previousMapView = {
      center: map.getCenter(),
      zoom: map.getZoom()
    }

    previousLayerState = saveLayerState()
    applyLayerState({
      boerderij: false,
      verkooppunten: false,
      polder: true,
      amstelland: true,
      heatmap: false
    })
  } else if (previousLayerState) {
    applyLayerState(previousLayerState)
    previousLayerState = null

    if (previousMapView) {
      map.flyTo(previousMapView.center, previousMapView.zoom, {
        duration: 1.2
      })

      previousMapView = null
    }
  }

  updateLayers()
})

/* -----------------------------
   LIVE HEATMAP
------------------------------*/
loadLiveHeatmapData()
setInterval(loadLiveHeatmapData, LIVE_HEATMAP_REFRESH_MS)

/* eerste keer laden */
updateLayers()


/* -----------------------------
   FIX LEAFLET
------------------------------*/
setTimeout(() => {
  map.invalidateSize()
}, 200)
