import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { tileLayer, latLng, Map, polyline, point, polygon } from 'leaflet';
import * as L from 'leaflet';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { NewYorkBridgesApiResponse } from 'src/app/models/new-york-bridges.model';
import { LeafletLayersModel } from 'src/app/models/leaflet-layers.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  bridgeSubscription: Subscription|null;
  bridgeResponse = null;
  bridgePageCount = null;
  nextBridgePage = 1;
  bridgeCalls = null;
  bridges = null;
  featureContainer = [];
  map: L.Map;

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

  layers: L.Layer[];
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
    zoom: 6,
    center: L.latLng(43.0, -75.3)
  };

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
  ) {
    this.apply();
  }

  ngOnInit() {
    setTimeout(() => { console.log(this.bridges); }, 5000);
  }

  ngAfterViewInit() {
    this.getRandomBridges(1);
  }

  apply() {
    // Get the active base layer
    const baseLayer = this.model.baseLayers.find((l: any) => (l.id === this.model.baseLayer));

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
  }

  onZoomChange(zoom: number) {
    if (zoom > 8) {
      const page = 1;
      this.getBridgesBbox(page, this.map.getBounds().pad(0.05));
    }
  }

  onMapMove(mapMoveEvent: Event) {
    const page = 1;
    const zoom = this.map.options.zoom;
    if (zoom) {
      this.getBridgesBbox(page, this.map.getBounds().pad(0.05));
    }
  }

  getBridgesBbox(page: number, bounds: L.bounds) {
    // If a request is already out, cancel it
    if (this.bridgeSubscription) {
      this.bridgeSubscription.unsubscribe();
    }
    this.bridgeSubscription = this.newYorkBridgeService.getNewYorkBridgesBounds(1, bounds)
      .subscribe(
        (data: NewYorkBridgesApiResponse) => {
            const bridgesGeoJSON = {
              id: 'bridgesGeoJSON',
              name: 'Bridges Geo JSON',
              enabled: true,
              layer: L.geoJSON(
                (data.results) as any
              )
            };

            this.model.overlayLayers = this.model.overlayLayers.filter(overlay => {
              return overlay.id !== 'bridgesGeoJSON';
            });
            this.bridges = data.results;
            this.model.overlayLayers.push(bridgesGeoJSON);
            this.layersControl.overlays.Bridges = bridgesGeoJSON.layer;
        },
        err => { console.log(err); },
        () => { this.apply(); }
      );
  }

  getRandomBridges(zoom: number = null) {
    // If a pan/zoom getBridges request exists, might as well cancel it
    if (this.bridgeSubscription) {
      this.bridgeSubscription.unsubscribe();
    }
    this.newYorkBridgeService.getNewYorkBridgesHeavyTraffic(this.nextBridgePage)
    .subscribe(
      (data: NewYorkBridgesApiResponse) => {
        const bridgesGeoJSON = {
          id: 'bridgesGeoJSON',
          name: 'Bridges Geo JSON',
          enabled: true,
          layer: L.geoJSON(
            (data.results) as any
          )
        };
        this.bridges = data.results;
        this.model.overlayLayers.push(bridgesGeoJSON);
        this.layersControl.overlays.Bridges = bridgesGeoJSON.layer;
      },
      err => {console.log(err); },
      () => {
        this.apply();
      }
    );
  }
}
