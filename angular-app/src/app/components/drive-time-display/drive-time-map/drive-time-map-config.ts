import * as L from 'leaflet';

export const bridgeMarker = L.icon({
  iconUrl: 'assets/marker-icon-yellow.png',
  shadowUrl: 'leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -20.5]
});
