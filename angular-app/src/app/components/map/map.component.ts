import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { tileLayer, latLng, Map, polyline, point, polygon } from 'leaflet';
import * as L from 'leaflet';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { NewYorkBridgesApiResponse, NewYorkBridgeFeature } from 'src/app/models/new-york-bridges.model';
import { LeafletLayersModel } from 'src/app/models/leaflet-layers.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  bboxSubscription: Subscription|null;
  randomSubscription: Subscription|null;
  bridgeResponse = null;
  bridgePageCount = null;
  nextBridgePage = 1;
  bridgeCalls = null;
  bridges = null;
  featureContainer = [];
  map: L.Map;
  padding = 0.25;
  loadingBridges: boolean;
  bridgeMarker = L.icon({
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  });

  LAYER_WIKIMEDIA_MAP = {
    id: 'wikimediamap',
    name: 'Wikimedia Map',
    detectRetina: true,
    enabled: true,
    layer: L.tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  };
  LAYER_OPEN_STREET_MAP = {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    detectRetina: true,
    enabled: true,
    layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  };

  studyArea = {
    id: 'studyarea',
    name: 'Routable Network Extent',
    enabled: true,
    layer: L.polygon([
      [41.5679, -78.3377],
      [41.5679, -72.7328],
      [44.2841, -72.7328],
      [44.2841, -78.3377]
    ])
  };

  studyArea2  = {
    id: 'studyarea2',
    name: 'Study area 2',
    enabled: true,
    layer: L.polygon([
      [42.44040861851155, -73.97946599681609],
      [42.44040861851155, -73.5713780501485],
      [42.86769928070402, -73.5713780501485],
      [42.86769928070402, -73.97946599681609]
    ])
  };

  model = new LeafletLayersModel(
    [
      this.LAYER_OPEN_STREET_MAP,
      this.LAYER_WIKIMEDIA_MAP
    ],
    this.LAYER_OPEN_STREET_MAP.id,
    [
      this.studyArea,
      this.studyArea2
    ]
  );

  layers: Array<L.Layer>;
  layersControl: {[k: string]: any} = {
    baseLayers: {
      OpenStreetMap: this.LAYER_OPEN_STREET_MAP.layer,
      'Wikimedia Map': this.LAYER_WIKIMEDIA_MAP.layer
    },
    overlays: {
      'Routable Network Extent': this.studyArea.layer,
      'Drive Time BBox': this.studyArea2.layer
    }
  };

  options = {
    zoom: 7,
    center: L.latLng(43.0, -75.3)
  };

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
  ) {
    this.apply();
  }

  ngOnInit() {
    this.loadingBridges = true;
  }

  ngAfterViewInit() {

  }

  apply() {
    // Get the active base layer
    const baseLayer: any = this.model.baseLayers.find((l: any) => (l.id === this.model.baseLayer));

    // Get all the active overlay layers
    const newLayers = this.model.overlayLayers
      .filter((l: any) => l.enabled)
      .map((l: any) => l.layer);
    newLayers.unshift(baseLayer.layer);

    this.layers = newLayers;

    return false;
  }

  onMapReady(map: L.Map) {
    this.map = map;
    const showBridges = false;
    this.getRandomBridges(false);
  }

  onZoomChange(zoom: number) {
    this.model.overlayLayers = this.model.overlayLayers.filter(overlay => {
      return overlay.id !== 'bridgesGeoJSON';
    });
    this.apply();

    const page = 1;
    if (zoom >= 8) {
      this.getBridgesBbox(page, this.map.getBounds().pad(this.padding));
    } else {
      this.getRandomBridges(false);
    }
  }

  onMapMove(mapMoveEvent: Event) {
    const page = 1;
    const zoom = this.map.getZoom();
    let mapBoundsContained = null;
    let padding = this.padding;

    // When zoomed in, check if the map bounds lies within the
    // bridges bounds (bounding box, bbox). If so, don't load data.
    // If not, load data based on zoom
    if (this.model.overlayLayers) {
      if (zoom > 12) {
        padding = this.padding + 0.25;
      } else {
        padding = this.padding;
      }
      mapBoundsContained = this.bridges.layer.getBounds().pad(padding).contains(
        this.map.getBounds()
      );
    } else {
      mapBoundsContained = false;
      this.loadingBridges = true;
    }
    if (!mapBoundsContained) {
      if (zoom >= 8) {
        this.getBridgesBbox(page, this.map.getBounds().pad(padding));
      } else {
        this.getRandomBridges(false);
      }
    }
  }

  bridgePopupHtml(feature: NewYorkBridgeFeature) {
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
      `BIN:${feature.properties.bin}_${feature.properties.common_name}`
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
        `<dd> <a href=${bingMapsUrl}"> Bing Maps </a> </dd> </dl>`;
  }

  bridgesEnabled() {
    let enableBridges: boolean|null = null;
    if (this.bridges) {
      enableBridges = this.map.hasLayer(this.bridges.layer);
    } else {
      enableBridges = true;
    }
    return enableBridges;
  }

  getBridgesBbox(page: number, bounds: any) {
    // If a request is already out, cancel it
    this.cancelRequests();
    this.loadingBridges = true;
    this.bboxSubscription = this.newYorkBridgeService.getNewYorkBridgesBounds(1, bounds)
      .subscribe(
        (data: NewYorkBridgesApiResponse) => {

          const bridgesGeoJSON = {
            id: 'bridgesGeoJSON',
            name: 'Bridges Geo JSON',
            enabled: true, // this.bridgesEnabled(),
            layer: L.geoJSON(
              (data.results) as any, {
                onEachFeature: (feature: any, layer: L.Layer) => {
                  layer.bindPopup(this.bridgePopupHtml(feature));
                },
                pointToLayer: (feature, latLng) => {
                  return L.marker(latLng, {icon: this.bridgeMarker});
                }
              }
            )
          };
          this.bridges = bridgesGeoJSON;
      },
      err => {
        this.model.overlayLayers = this.model.overlayLayers.filter(overlay => {
          return overlay.id !== 'bridgesGeoJSON';
        });
        this.loadingBridges = this.apply();
      },
      () => {
        this.model.overlayLayers = this.model.overlayLayers.filter(overlay => {
          return overlay.id !== 'bridgesGeoJSON';
        });
        this.apply();
        this.model.overlayLayers.push(this.bridges);
        this.layersControl.overlays.Bridges = this.bridges.layer;
        this.loadingBridges = this.apply();
      }
    );
  }

  getRandomBridges(enable: boolean) {
    // If a pan/zoom getBridges request exists, might as well cancel it
    enable = (typeof enable === 'undefined') ? true : enable;
    this.cancelRequests();
    this.loadingBridges = true;
    this.randomSubscription = this.newYorkBridgeService.getNewYorkBridgesRandom(1)
    .subscribe(
      (data: NewYorkBridgesApiResponse) => {

        this.apply();
        const bridgesGeoJSON = {
          id: 'bridgesGeoJSON',
          name: 'Bridges Geo JSON',
          enabled: enable, // this.bridgesEnabled(),
          layer: L.geoJSON(
            (data.results) as any, {
              onEachFeature: (feature: any, layer: L.Layer) => {
                layer.bindPopup(this.bridgePopupHtml(feature));
              },
              pointToLayer: (feature, latLng) => {
                return L.marker(latLng, {icon: this.bridgeMarker});
              }
            }
          )
        };
        this.bridges = bridgesGeoJSON;
      },
      err => {
        this.model.overlayLayers = this.model.overlayLayers.filter(overlay => {
          return overlay.id !== 'bridgesGeoJSON';
        });
        this.loadingBridges = this.apply();
      },
      () => {
        this.model.overlayLayers = this.model.overlayLayers.filter(overlay => {
          return overlay.id !== 'bridgesGeoJSON';
        });
        this.apply();
        this.model.overlayLayers.push(this.bridges);
        this.layersControl.overlays.Bridges = this.bridges.layer;
        this.loadingBridges = this.apply();
      }
    );
  }

  cancelRequests() {
    if (this.bboxSubscription) {
      this.bboxSubscription.unsubscribe();
    }
    if (this.randomSubscription) {
      this.randomSubscription.unsubscribe();
    }
  }
}
