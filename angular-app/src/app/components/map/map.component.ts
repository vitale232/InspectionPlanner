import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { tileLayer, latLng, Map, polyline, point, polygon } from 'leaflet';
import * as L from 'leaflet';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { NewYorkBridgesApiResponse, NewYorkBridgeFeature } from 'src/app/models/new-york-bridges.model';
import { LeafletLayersModel } from 'src/app/models/leaflet-layers.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  title = 'angular-app';
  bboxSubscription: Subscription|null;
  randomSubscription: Subscription|null;
  bridges = null;
  bridgeBounds: L.LatLngBounds;
  map: L.Map;
  padding = 0.25;
  loadingBridges: boolean;
  bridgeMarker = L.icon({
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41]
  });

  LAYER_WIKIMEDIA_MAP = {
    id: 'wikimediamap',
    name: 'Wikimedia Map',
    detectRetina: true,
    enabled: true,
    layer: L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  };
  LAYER_OPEN_STREET_MAP = {
    id: 'openstreetmap',
    name: 'OpenStreetMap',
    detectRetina: true,
    enabled: true,
    layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    ]).setStyle({fillOpacity: 0.0})
  };

  model = new LeafletLayersModel(
    [
      this.LAYER_WIKIMEDIA_MAP,
      this.LAYER_OPEN_STREET_MAP,
    ],
    this.LAYER_WIKIMEDIA_MAP.id,
    [
      this.studyArea,
    ]
  );

  layers: Array<L.Layer>;
  layersControl: {[k: string]: any} = {
    baseLayers: {
      'Wikimedia Map': this.LAYER_WIKIMEDIA_MAP.layer,
      OpenStreetMap: this.LAYER_OPEN_STREET_MAP.layer,
    },
    overlays: {
      'Routable Network Extent': this.studyArea.layer,
    }
  };

  // options = {
  //   zoom: 7,
  //   center: L.latLng(43.0, -75.3)
  // };
  mapZoom = 7;
  mapCenter = L.latLng(43.0, -75.3);

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.apply();
  }

  ngOnInit() {
    this.loadingBridges = true;
  }

  onMapReady(map: L.Map) {
    this.map = map;
    const showBridges = false;
    this.getRandomBridges(false);
    this.route.queryParamMap.subscribe(
      queryParams => {
        const params = 'params';
        const lat = 'lat';
        const lon = 'lon';
        const z = 'z';
        // If there are query params in the URL, use them to set the map options
        if (queryParams[params][lat] &&
            queryParams[params][lon] &&
            queryParams[params][z]) {

          this.mapZoom = queryParams[params][z];
          this.mapCenter = new L.LatLng(queryParams[params][lat], queryParams[params][lon]);
        }
      });
    if (this.mapZoom < 8) {
      this.openSnackbar('Zoom in to view bridges! (19,890 total)', 5000);
    }
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
      this.openSnackbar('Zoom in to view bridges! (19,890 total)', 5000);
    }
    this.mapZoom = zoom;
    this.updateUrl(zoom);
    // const centerCoords = this.map.getCenter();
    // console.log(centerCoords);
    // const queryParams = {
    //   lat: Number(centerCoords.lat.toFixed(6)),
    //   lon: Number(centerCoords.lng.toFixed(6)),
    //   z: zoom
    // };
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: queryParams,
    // });
    // this.mapZoom = zoom;
    // const lat = 'lat';
    // const lon = 'lon';
    // this.mapCenter = new L.LatLng(queryParams[lat], queryParams[lon]);

  }
  openSnackbar(message: string, duration: number = 2500) {
    this.snackBar.open(message, 'Close', {
      duration,
      panelClass: ['snackbar'],
      horizontalPosition: 'start'
    });
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

  updateUrl(zoom: number|null) {
    if (this.map) {
      // if (zoom) {
      //   this.mapZoom = zoom;
      // }
      const centerCoords = this.map.getCenter();
      const queryParams = {
        lat: centerCoords.lat.toFixed(4),
        lon: centerCoords.lng.toFixed(4),
        z: this.mapZoom
      };
      const lat = 'lat';
      const lon = 'lon';

      const url = this.router
        .createUrlTree([], {relativeTo: this.route, queryParams })
        .toString();
      this.location.replaceState(url);
      // this.router.navigate([], {
      //   relativeTo: this.route,
      //   queryParams,
      // });
    }
  }

  onMapMove(mapMoveEvent: Event) {
    const page = 1;
    let zoom = null;
    if (this.map) {
      zoom = this.map.getZoom();
    }
    let mapBoundsContained = null;
    let padding = this.padding;

    // When zoomed in, check if the map bounds lies within the
    // bridges bounds (bounding box, bbox). If so, don't load data.
    // If not, load data based on zoom
    if (this.model.overlayLayers && zoom) {
      if (zoom > 12) {
        padding = this.padding + 0.25;
      } else {
        padding = this.padding;
      }
      if (this.bridgeBounds) {
        mapBoundsContained = this.bridgeBounds.pad(padding).contains(
          this.map.getBounds()
        );
      }
    } else {
      mapBoundsContained = false;
      this.loadingBridges = true;
    }
    if (!mapBoundsContained) {
      if (zoom && zoom >= 8) {
        this.getBridgesBbox(page, this.map.getBounds().pad(padding));
      } else {
        this.getRandomBridges(false);
      }
    }
    this.updateUrl(null);
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
          this.bridgeBounds = this.bridges.layer.getBounds();
          this.openSnackbar(
            `Displaying ${data.results.features.length} of ${data.count} bridges`);
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
        this.bridgeBounds = this.bridges.layer.getBounds();
        // this.openSnackbar(
        //   `Displaying ${data.results.features.length} of ${data.count} bridges`);
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
