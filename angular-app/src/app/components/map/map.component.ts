import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { tileLayer, latLng, Map, polyline, point, polygon } from 'leaflet';
import * as L from 'leaflet';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { NewYorkBridgesApiResponse } from 'src/app/models/new-york-bridges.model';
import { LeafletLayersModel } from 'src/app/models/leaflet-layers.model';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  title = 'angular-app';
  bridgeResponse = null;
  bridgePageCount = null;
  nextBridgePage = 1;
  bridgeCalls = null;
  bridges = null;
  featureContainer = [];

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

  geoJSON = {
    id: 'geoJSON',
    name: 'Geo JSON Polygon',
    enabled: true,
    layer: L.geoJSON(
      ({
        type: 'Polygon',
        coordinates: [[
          [42.44040861851155, -73.97946599681609],
          [42.44040861851155, -73.5713780501485],
          [42.86769928070402, -73.5713780501485],
          [42.86769928070402, -73.97946599681609]
        ]]
      }) as any,
      { style: () => ({ color: '#ff7800' })})
  };

  model = new LeafletLayersModel(
    [
      this.LAYER_OPEN_STREET_MAP,
      this.LAYER_WIKIMEDIA_MAP
    ],
    this.LAYER_OPEN_STREET_MAP.id,
    [
      this.studyArea,
      this.geoJSON,
      this.studyArea2
    ]
  );

  layers: L.Layer[];
  layersControl = {
    baseLayers: {
      OpenStreetMap: this.LAYER_OPEN_STREET_MAP.layer,
      'Wikimedia Map': this.LAYER_WIKIMEDIA_MAP.layer
    },
    overlays: {
      Extent: this.studyArea.layer,
      GeoJSON: this.geoJSON.layer,
      Extent2: this.studyArea2.layer
    }
  };

  options = {
    zoom: 6,
    center: L.latLng(43.2994, -74.2179)
  };

  // overlaysGroup = L.layerGroup();
  // allOverlays = [this.studyArea];

  // layersControl = {
  //   baseLayers: {
  //     'Wikimedia Maps': this.wMaps,
  //     'Open Street Map': this.osm,
  //   },
  //   overlays: {
  //     'Extent of routable network': this.studyArea,
  //     // 'GeoJSON': L.geoJSON(this.bridges),
  //     'overlays': this.overlaysGroup
  //   }
  // };

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
  ) {
    this.apply();
  }

  ngOnInit() {
    setTimeout(() => { console.log(this.bridges); }, 5000);
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

  ngAfterViewInit() {
    console.log('after init');
  }

  // handleBridgePages() {
  //   if (this.bridgeResponse.count) {
  //     this.bridgePageCount = Math.ceil(this.bridgeResponse.count / 100);
  //   }
  //   if (this.bridgeResponse.next) {
  //     this.nextBridgePage = this.bridgeResponse.next[this.bridgeResponse.next.length - 1];
  //   }
  // }

  // getBridges(map: L.Map = null) {
  //   console.log(`next page: ${this.nextBridgePage}`);
  //   this.newYorkBridgeService.getNewYorkBridgesHeavyTraffic(this.nextBridgePage)
  //   .subscribe(
  //     data => {
  //       this.bridges = data.results;
  //       this.bridgeResponse = data;
  //     },
  //     err => {console.log(err); },
  //     () => {
  //       if (map) {
  //         // L.geoJSON(this.bridges).addTo(map);
  //         // this.layersControl.overlays.GeoJSON = L.geoJSON(this.bridges);
  //         // this.options.layers = this.options.layers.push(this.layersControl.overlays.GeoJSON);
  //         // console.log(this.layersControl);
  //         // console.log(this.options);
  //       }
  //       this.handleBridgePages();
  //     }
  //   );
  // }

  // onMapReady(map: L.Map) {
  //   this.allOverlays.forEach(overlay => {
  //     overlay.addTo(this.overlaysGroup);
  //   });
  //   // this.getBridges(map);
  //   // map.fitBounds(this.studyArea.getBounds(), {
  //   //   padding: L.point(24, 24),
  //   //   maxZoom: 12,
  //   //   animate: true
  //   // });
  // }

  // // getBridgeCalls() {
  // //   const calls = [];
  // //   for (let i = 2; i < this.bridgePageCount; i++) { // replace 10 w this.bridgePageCount
  // //     calls.push(
  // //       this.newYorkBridgeService.getNewYorkBridgesHeavyTraffic(i)
  // //     );
  // //   }
  // //   this.bridgeCalls = calls;
  // // }

  // // getMoreBridges(map: L.Map = null) {
  // //   forkJoin(this.bridgeCalls).subscribe(
  // //     (getRequestArray) => {
  // //       getRequestArray.forEach((bridgePage: NewYorkBridgesApiResponse) => {
  // //         bridgePage.results.features.forEach(feature => {
  // //           this.bridges.features.push(feature);
  // //         });
  // //       } );
  // //     },
  // //     err => {
  // //       console.log(err);
  // //     },
  // //     () => {
  // //       console.log('complete');
  // //       console.log(this.bridges);
  // //     }
  // //   );
  // // }
}
