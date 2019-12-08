import * as L from 'leaflet';

export const bridgeMarker = L.icon({
  iconUrl: 'assets/marker-icon-yellow.png',
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -20.5]
});

export const driveTimeSearchMarker = L.icon({
  iconUrl: 'assets/marker-icon-violet.png',
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -20.5]
});

export const gridBinSelectionMarker = {
  radius: 10,
  color: '#2A82CB',
  weight: 5,
  fill: true,
  fillColor: '#CAC42B',
  fillOpacity: 0.5,
};
