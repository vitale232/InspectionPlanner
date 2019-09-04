import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import {
  NewYorkBridgesApiResponse,
  NewYorkBridgeFeature,
} from 'src/app/models/new-york-bridges.model';
import { LeafletLayersModel } from 'src/app/models/leaflet-layers.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SearchService } from 'src/app/services/search.service';
import { filter } from 'rxjs/operators';
import { LocationSearchResult, ClientLocation } from 'src/app/models/location-search.model';
import { NotificationsService } from 'angular2-notifications';
import { ClientLocationService } from 'src/app/services/client-location.service';
import { MapToolsService } from 'src/app/services/map-tools.service';
import { MapExtent } from 'src/app/models/map-tools.model';
import { SidenavService } from 'src/app/services/sidenav.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  title = 'angular-app';
  bboxSubscription: Subscription|null;
  randomSubscription: Subscription|null;
  locationSearchSubscription: Subscription|null;
  clientLocationSubscription: Subscription|null;
  mapHomeSubscription: Subscription|null;
  clearMarkersSubscription: Subscription|null;
  binSearchSubscription: Subscription|null;
  bridges = null;
  bridgeBounds: L.LatLngBounds|null = null;
  map: L.Map;
  padding = 0.25;
  loadingBridges: boolean;
  mapZoom = 7;
  mapCenter = L.latLng(43.0, -75.3);

  bridgeMarker = L.icon({
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -20.5]
  });
  searchMarker = L.icon({
    iconUrl: 'assets/marker-icon-red.png',
    shadowUrl: 'leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -20.5]
  });
  clientLocationMarker = L.icon({
    iconUrl: 'assets/marker-icon-black.png',
    shadowUrl: 'leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -20.5]
  });
  LAYER_WIKIMEDIA_MAP = {
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
  LAYER_OPEN_STREET_MAP = {
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

  LAYER_ESRI_WORLD_TOPO = {
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

  LAYER_ESRI_WORLD_IMAGERY = {
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
      this.LAYER_ESRI_WORLD_TOPO,
      this.LAYER_ESRI_WORLD_IMAGERY
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
      'Esri World Topo': this.LAYER_ESRI_WORLD_TOPO.layer,
      'Esri World Imagery': this.LAYER_ESRI_WORLD_IMAGERY.layer,
    },
    overlays: {
      'Routable Network Extent': this.studyArea.layer,
    }
  };

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private searchService: SearchService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private changeDetector: ChangeDetectorRef,
    private notifications: NotificationsService,
    private clientLocationService: ClientLocationService,
    private mapToolsService: MapToolsService,
    private sidenavService: SidenavService
  ) { }

  ngOnInit() {
    this.loadingBridges = true;
    this.apply();
    this.locationSearchSubscription = this.searchService.getLocationSearchResult$()
      .pipe(filter(Boolean))
      .subscribe(
        (data: LocationSearchResult) => this.applyLocationSearch(data),
        (err) => {
          this.notifications.error(
            'Unhandled error',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
          });
        }
      );
    this.clientLocationSubscription = this.clientLocationService.getClientLocation$()
      .subscribe(
        (data: ClientLocation) => {
          this.applyClientLocationQuery(data);
        },
        (err) => {
          this.notifications.error(
            'Unhandled error : applyClientLocationQuery : map',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
          });
        }
      );
    this.mapHomeSubscription = this.mapToolsService.getMapHome$()
      .subscribe(
        (data: MapExtent) => {
          this.mapCenter = new L.LatLng(data.lat, data.lon);
          this.mapZoom = data.z;
          this.sidenavService.close();
        }, (err) => {
          this.notifications.error(
            'Unhandled error : mapHomeSubscription : MapComponent',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
            });
        }
      );
    this.binSearchSubscription = this.newYorkBridgeService.getBridgeFeature$()
      .subscribe(
        (data: NewYorkBridgeFeature) => {
          this.applyBinSearch(data);
          this.sidenavService.close();
        }, (err) => {
          this.notifications.error(
            'Unhandled error : BinSearchSubscription : MapComponent',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
            });
        }
      );
    this.clearMarkersSubscription = this.mapToolsService.getClearMarkers$()
      .subscribe(
        (data: boolean) => {
          this.filterOverlays('Search result');
          this.filterOverlays('Current location', true);
          this.filterOverlays('BIN result');
          this.sidenavService.close();
        }, (err) => {
          this.notifications.error(
            'Unhandled error: clearMarkersSubscription: MapComponent',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true,
            }
          );
        }
      );
  }

  ngOnDestroy() {
    this.cancelRequests();
    this.locationSearchSubscription.unsubscribe();
    this.clientLocationSubscription.unsubscribe();
    this.binSearchSubscription.unsubscribe();
    this.mapHomeSubscription.unsubscribe();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    this.getRandomBridges(false);
    this.route.queryParamMap.subscribe(
      queryParams => {
        // Create objects of indices for TypeScript
        const params = 'params';
        const lat = 'lat';
        const lon = 'lon';
        const zoom = 'z';
        // If there are query params in the URL, use them to set the map options
        if (queryParams[params][lat] &&
            queryParams[params][lon] &&
            queryParams[params][zoom]) {

          this.mapZoom = queryParams[params][zoom];
          this.mapCenter = new L.LatLng(queryParams[params][lat], queryParams[params][lon]);
        }
      });
    if (this.mapZoom < 8) {
      this.openSnackbar('Zoom in to view bridges! (19,890 total)', 5000);
    }
  }

  applyLocationSearch(searchResult: LocationSearchResult) {
    if (searchResult) {
      const latLong = new L.LatLng(
        parseFloat(searchResult.lat),
        parseFloat(searchResult.lon)
      );
      this.mapZoom = searchResult.z;
      this.mapCenter = latLong;
      // Force angular change detection to update map
      this.changeDetector.detectChanges();
      this.updateUrl(searchResult.z);

      this.model.overlayLayers.push({
        id: 'Search result',
        name: 'Search results',
        enabled: true,
        layer: L.marker(latLong, { icon: this.searchMarker }).bindPopup(
          `<address> <strong> ${searchResult.displayName} </strong> </address> ` +
          `<dl> <dt> Latitude, Longitude: </dt> <dd> ` +
            `${parseFloat(searchResult.lat).toFixed(4)}, ` +
            `${parseFloat(searchResult.lon).toFixed(4)} </dd>` +
          `<dt> OSM Type: </dt> <dd> ${searchResult.osmType} </dd> ` +
          `<dt> Class: </dt> <dd> ${searchResult.class} </dd> ` +
          `<dt> Type: </dt> <dd> ${searchResult.type} </dd> </dl>`
        )

      });
      this.apply();
      this.onZoomChange(searchResult.z);
    }
  }

  applyBinSearch(feature: NewYorkBridgeFeature) {
    this.mapCenter = new L.LatLng(
      feature.geometry.coordinates[1],
      feature.geometry.coordinates[0]
    );
    this.mapZoom = 14;

    this.changeDetector.detectChanges();
    this.updateUrl(this.mapZoom);

    const binSearchResult = {
      id: `BIN result`,
      name: `BIN ${feature.properties.bin}`,
      enabled: true,
      layer: L.circleMarker(this.mapCenter, {
        radius: 10,
        color: '#FFC23D',
        weight: 5,
        fill: true,
        fillColor: '#2A82CB',
        fillOpacity: 0.5,
      }).bindPopup(this.bridgePopupHtml(feature))
      .openPopup()
    };
    this.model.overlayLayers.push(binSearchResult);
    this.apply();
    this.onZoomChange(this.mapZoom);
  }

  applyClientLocationQuery(clientLocation: ClientLocation) {
    const latLong = new L.LatLng(clientLocation.lat, clientLocation.lon);

    this.mapZoom = 14;
    this.mapCenter = latLong;

    this.changeDetector.detectChanges();
    this.updateUrl(this.mapZoom);

    this.model.overlayLayers.push({
      id: 'Current location',
      name: 'Current location',
      enabled: true,
      layer: L.marker(latLong, { icon: this.clientLocationMarker }).bindPopup(
        `<p><strong>Current browser location</strong></p>` +
        `<dl> <dt> Latitude, Longitude: </dt> <dd> ` +
          `${clientLocation.lat.toFixed(4)}, ` +
          `${clientLocation.lon.toFixed(4)} </dd>` +
        `<dt> Timestamp: </dt> <dd> ` +
          `${(new Date(clientLocation.timestamp)).toLocaleString()} </dd> `
      )
    });
    this.apply();
    this.onZoomChange(this.mapZoom);
  }

  onZoomChange(zoom: number) {
    // this.model.overlayLayers = this.model.overlayLayers
    //   .filter(overlay => overlay.id !== 'bridgesGeoJSON');
    this.filterOverlays('bridgesGeoJSON');
    this.apply();

    // Get random bridges when zoomed out, get bounding box + padding when zoomed in
    if (zoom >= 8) {
      this.getBridgesBbox(1, this.map.getBounds().pad(this.padding));
    } else {
      this.getRandomBridges(false);
      this.openSnackbar('Zoom in to view bridges! (19,890 total)', 5000);
    }
    this.mapZoom = zoom;
    this.updateUrl(zoom);
  }

  apply() {
    // Get the active base layer
    const baseLayer: any = this.model.baseLayers
      .find((l: any) => (l.id === this.model.baseLayer));

    // Get all the active overlay layers
    const newLayers = this.model.overlayLayers
      .filter((l: any) => l.enabled)
      .map((l: any) => l.layer);
    newLayers.unshift(baseLayer.layer);

    this.layers = newLayers;

    return false;
  }

  filterOverlays(layerId: string, applyNow: boolean = false) {
    this.model.overlayLayers = this.model.overlayLayers
      .filter(overlay => overlay.id !== layerId);
    if (applyNow) {
      this.onZoomChange(this.mapZoom);
    }
  }

  updateUrl(zoom: number|null) {
    if (this.map) {
      const centerCoords = this.map.getCenter();
      const queryParams = {
        lat: centerCoords.lat.toFixed(4),
        lon: centerCoords.lng.toFixed(4),
        z: this.mapZoom
      };

      const url = this.router
        .createUrlTree([], {relativeTo: this.route, queryParams })
        .toString();
      this.location.replaceState(url);
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
        // Add a little extra padding when its likely the entire
        // first page of bridges are within the map extent
        padding = this.padding + 0.25;
      }
      if (this.bridgeBounds) {
        mapBoundsContained = this.bridgeBounds
          .pad(padding)
          .contains(this.map.getBounds());
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

  getBridgesBbox(page: number, bounds: L.LatLngBounds) {
    // If a request is already out, cancel it
    this.cancelRequests();
    this.loadingBridges = true;
    this.bboxSubscription = this.newYorkBridgeService
      .getNewYorkBridgesBounds(1, bounds)
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
            `Displaying ${data.results.features.length} ` +
            `of ${data.count.toLocaleString()} bridges`);
      },
      err => {
        // this.model.overlayLayers = this.model.overlayLayers
        //   .filter(overlay => overlay.id !== 'bridgesGeoJSON');
        this.filterOverlays('bridgesGeoJSON');
        this.loadingBridges = this.apply();
        this.notifications.error(
          'getBridgesBbox(): Unhandled error',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
            timeOut: 20000,
            showProgressBar: true,
            pauseOnHover: true,
            clickToClose: true
        });
      },
      () => {
        // this.model.overlayLayers = this.model.overlayLayers
        //   .filter(overlay => overlay.id !== 'bridgesGeoJSON');
        this.filterOverlays('bridgesGeoJSON');
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
    this.randomSubscription = this.newYorkBridgeService
      .getNewYorkBridgesRandom(1)
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
                pointToLayer: (_FEATURE, latLng) => L.marker(latLng, {icon: this.bridgeMarker})
              }
            )
          };
          this.bridges = bridgesGeoJSON;
          this.bridgeBounds = this.bridges.layer.getBounds();
        },
        err => {
          // this.model.overlayLayers = this.model.overlayLayers
          //   .filter(overlay => overlay.id !== 'bridgesGeoJSON');
          this.filterOverlays('bridgesGeoJSON');
          this.loadingBridges = this.apply();
          this.notifications.error(
            'getRandomBridges(): Unhandled error',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
          });
        },
        () => {
          // this.model.overlayLayers = this.model.overlayLayers
          //   .filter(overlay => overlay.id !== 'bridgesGeoJSON');
          this.filterOverlays('bridgesGeoJSON');
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
      this.loadingBridges = false;
    }
    if (this.randomSubscription) {
      this.randomSubscription.unsubscribe();
      this.loadingBridges = false;
    }
  }

  openSnackbar(message: string, duration: number = 2500) {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      panelClass: ['snackbar'],
      horizontalPosition: 'start'
    });
  }

}
