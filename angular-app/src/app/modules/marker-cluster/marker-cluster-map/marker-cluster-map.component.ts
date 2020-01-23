import { Component, OnInit, OnDestroy } from '@angular/core';
import { BridgesService } from 'src/app/shared/services/bridges.service';

import * as L from 'leaflet';
import { IBridgeFeatureCollection, IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-marker-cluster-map',
  templateUrl: './marker-cluster-map.component.html',
  styleUrls: ['./marker-cluster-map.component.scss']
})
export class MarkerClusterMapComponent implements OnInit, OnDestroy {

  markerClusterData: L.Marker[];
  map: L.Map;
  subscriptions = new Subscription();

  mapZoom = 7;
  mapCenter = L.latLng(43.0, -75.3);
  wikimediaMap = {
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
  options = {
    layers: [ this.wikimediaMap.layer ],
    zoom: this.mapZoom,
    center: this.mapCenter,
  };

  constructor(
    private bridgeService: BridgesService,
    private sidenav: SidenavService,
    ) { }

  ngOnInit() {
    this.bridgeService.getAllBridges().subscribe(
      data => this.markerClusterData = this.generateMarkerCluster(data),
      err => console.error(err)
    );
    this.subscriptions.add(this.sidenav.sidenavState$.subscribe(
      () => this.invalidateMapSize(),
      err => console.error(err),
      () => this.invalidateMapSize()
    ));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onMapReady(map: L.Map): void {
    this.map = map;
  }

  onResize(event: Event): void {
    this.invalidateMapSize();
  }

  invalidateMapSize(): void {
    if (this.map) {
      setTimeout(() => this.map.invalidateSize(), 50);
    }
  }

  generateMarkerCluster(data: IBridgeFeatureCollection): L.Marker[] {
    const icon = L.icon({
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12.5, 41],
      popupAnchor: [0, -20.5]
    });
    return data.features.map(feature => L.marker([
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0]
    ], { icon }).bindPopup(this.bridgePopupHtml(feature)));
  }

  bridgePopupHtml(feature: IBridgeFeature) {
    const openStreetMapUrl = (
      `https://www.openstreetmap.org/` +
      `?mlat=${feature.geometry.coordinates[1]}` +
      `&mlon=${feature.geometry.coordinates[0]}&zoom=14`
    );
    const googleMapsUrl = (
      `https://www.google.com/maps/search/?api=1&query=` +
      `${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`
    );
    const bingMapsUrl = (
      `https://www.bing.com/maps?sp=point.` +
      `${feature.geometry.coordinates[1]}_${feature.geometry.coordinates[0]}_` +
      `BIN:${feature.properties.bin}_` +
      `Inspected:${feature.properties.inspection}`
    );
    return `<dl> <dt> BIN: </dt> <dd> ${feature.properties.bin} </dd>` +
      `<dt> Carried: </dt> <dd> ${feature.properties.carried} </dd>` +
      `<dt> County: </dt> <dd> ${feature.properties.county_name} </dd>` +
      `<dt> AADT: </dt> <dd> ${feature.properties.aadt} </dd>` +
      `<dt> AADT: Year </dt> <dd> ${feature.properties.year_of_aadt} </dd>` +
      `<dt> Inspection: </dt> <dd> ${feature.properties.inspection} </dd> ` +
      `<dt> Common Name: </dt> <dd> ${feature.properties.common_name} </dd> ` +
      `<dt> Navigation: <dt> ` +
        `<dd> <a href=${openStreetMapUrl}> OpenStreetMap </a> </dd> ` +
        `<dd> <a href="${googleMapsUrl}"> Google Maps </a> </dd>` +
        `<dd> <a href="${bingMapsUrl}"> Bing Maps </a> </dd> </dl>`;
  }
}
