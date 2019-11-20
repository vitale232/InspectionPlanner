import * as L from 'leaflet';

export const bridgeMarker = L.icon({
  iconUrl: 'leaflet/marker-icon.png',
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -20.5]
});

export const searchMarker = L.icon({
  iconUrl: 'assets/marker-icon-red.png',
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -20.5]
});

export const clientLocationMarker = L.icon({
  iconUrl: 'assets/marker-icon-black.png',
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -20.5]
});

export const binSearchMarkerConfig = {
  radius: 10,
  color: '#FFC23D',
  weight: 5,
  fill: true,
  fillColor: '#2A82CB',
  fillOpacity: 0.5,
};

export const LAYER_WIKIMEDIA_MAP = {
  id: 'wikimediamap',
  name: 'Wikimedia Map',
  detectRetina: true,
  enabled: true,
  layer: L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap</a> contributors'
  })
};

export const LAYER_OPEN_STREET_MAP = {
  id: 'openstreetmap',
  name: 'OpenStreetMap',
  detectRetina: true,
  enabled: true,
  layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap</a> contributors'
  })
};

export const LAYER_ESRI_WORLD_TOPO = {
  id: 'esriTopo',
  name: 'Esri World Topo Map',
  detectRetina: true,
  enabled: true,
  layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/' +
      'World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, ' +
      'iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, ' +
      'Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
  })
};

export const LAYER_ESRI_WORLD_IMAGERY = {
  id: 'esriImagery',
  name: 'Esri World Imagery',
  detectRetina: true,
  enabled: true,
  layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/' +
      'World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye' +
      ', Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  })
};

export const studyArea = {
  id: 'studyarea',
  name: 'Routable Network Extent',
  enabled: true,
  layer: L.polygon([
  [41.5679, -78.3377],
  [41.5679, -72.7328],
  [44.2841, -72.7328],
  [44.2841, -78.3377]
  ]).setStyle({fillOpacity: 0.0})
};
