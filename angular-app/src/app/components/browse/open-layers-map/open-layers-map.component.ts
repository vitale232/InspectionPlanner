import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';

import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import { buffer } from 'ol/extent';
import {Fill, Stroke, Circle, Icon, Style} from 'ol/style';
import {get as getProjection} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// import { Extent } from 'openlayers';
import GeoJSON from 'ol/format/GeoJSON';
import { Subscription } from 'rxjs';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Group from 'ol/layer/Group';
import { defaults as defaultControls, Attribution } from 'ol/control';
import ZoomToExtent from 'ol/control/ZoomToExtent';
import Select from 'ol/interaction/Select';
import { singleClick } from 'ol/events/condition';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';

import LayerSwitcher from 'ol-layerswitcher';
import PopupFeature from 'ol-ext/overlay/PopupFeature';
import Popup from 'ol-ext/overlay/Popup';
import Legend from 'ol-ext/control/Legend';
import { IMapView, IStyleStoreAADT, IMarker } from 'src/app/models/open-layers-map.model';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-open-layers-map',
  templateUrl: './open-layers-map.component.html',
  styleUrls: ['./open-layers-map.component.css']
})
export class OpenLayersMapComponent implements OnInit, OnChanges, OnDestroy {

  // Component inputs
  @Input() mapView: IMapView;
  @Input() markerInput: IMarker;

  // OpenLayers objects
  private map: Map;
  private view: View;
  private resolution: number;
  private vectorLayer: VectorLayer;
  private zoom: number;

  // Custom behaviors
  private forcedInvisible: boolean;
  private styleGroups: IStyleStoreAADT;
  private bridgeObservable: Subscription;

  constructor(
    private bridgeService: NewYorkBridgeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingIndicatorService: LoadingIndicatorService,
  ) { }

  ngOnInit() {
    this.zoom = this.mapView.zoom;
    this.forcedInvisible = false;
    console.log('this.mapView', this.mapView);
    this.view = new View({
      center: fromLonLat(this.mapView.center),
      zoom: this.zoom,
    });

    const vectorSource = new VectorSource({
      format: new GeoJSON({
        featureProjection: getProjection('EPSG:3857'),
      }),
      strategy: (extent: number[], resolution: number) => {
        // The default bbox strategy doesn't quite fit our needs. Default bbox will cache extents,
        // and forces download of all features for the largest extent encountered. This means that if you
        // zoom out to the entire state, find Rochester, then zoom in on Rochester, the data will not display
        // until the entire state has loaded. Since the entire state is time prohibitive, we'll force reload
        // every time the resolution changes.
        if (this.resolution && this.resolution !== resolution) {
          if (this.bridgeObservable) { this.bridgeObservable.unsubscribe(); }
          vectorSource.loadedExtentsRtree_.clear();
        }
        return [ extent ];
      },
      loader: (extent: number[], res: number) => {
        this.loadingIndicatorService.sendLoadingIndicatorState(true);
        console.log('loader!!!');
        this.resolution = res;
        if (this.bridgeObservable) { this.bridgeObservable.unsubscribe(); }
        this.bridgeObservable = this.bridgeService.getAllBridgesInBounds(this.extentToLonLat(extent)).subscribe(
          bridges => {
            const geojsonData = {
              type: 'FeatureCollection',
              features: bridges
            };
            console.log('geojsonData', geojsonData);
            vectorSource.clear();
            vectorSource.addFeatures(vectorSource.getFormat().readFeatures(geojsonData));
          },
          err => console.error(err),
          () => {
            console.log('Completed observable!');
            this.loadingIndicatorService.sendLoadingIndicatorState(false);
            setTimeout(() => this.map.updateSize(), 1);
          }
        );
      },
    });

    const selectAADTStyle = (f) => {
      const aadt = f.get('aadt');
      if (aadt <= 235) {
        return this.styleGroups.group0;
      } else if (aadt > 235 && aadt <= 1005) {
        return this.styleGroups.group1;
      } else if (aadt > 1005 && aadt <= 3735) {
        return this.styleGroups.group2;
      } else if (aadt > 3735 && aadt <= 11350) {
        return this.styleGroups.group3;
      } else if (aadt > 11350) {
        return this.styleGroups.group4;
      } else {
        return this.styleGroups.group0; // Fallback to group0 if aadt selection fails
      }
    };

    this.generateAADTStyles();
    this.vectorLayer = new VectorLayer({
      source: vectorSource,
      title: 'New York Bridges',
      type: 'overlay',
      visible: true,
      style: selectAADTStyle
    });

    const overlayGroup = new Group({
        title: 'Overlays',
        layers: [ this.vectorLayer ]
    });

    const basemapGroup = new Group({
        title: 'Basemaps',
        layers: [
            new TileLayer({
                title: 'Wikimedia',
                type: 'base',
                visible: true,
                source: new XYZ({
                    url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
                    attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">' +
                      'OpenStreetMap</a> contributors'
                  })
            }),
            new TileLayer({
                title: 'OpenStreetMap',
                type: 'base',
                visible: false,
                source : new OSM()
              }),
            new TileLayer({
              title: 'Esri World Topo',
              type: 'base',
              visible: false,
              source: new XYZ({
                attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">Powered by Esri, HERE, Garmin, Intermap, ' +
                    'increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, ' +
                    'Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), ' +
                    '© OpenStreetMap contributors, and the GIS User Community</a>',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
              })
            }),
            new TileLayer({
              title: 'Esri World Imagery',
              type: 'base',
              visible: false,
              source: new XYZ({
                attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Imagery/MapServer">Powered by Esri, DigitalGlobe, GeoEye, ' +
                    'Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, ' +
                    'and the GIS User Community</a>',
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                    'World_Imagery/MapServer/tile/{z}/{y}/{x}'
              })
            })
        ]
    });

    const attribution = new Attribution({
      collapsible: true,
      collapsed: true,
    });
    this.map = new Map({
      target: 'open-layers-map',
      layers: [ basemapGroup, overlayGroup ],
      view: this.view,
      controls: defaultControls({attribution: false}).extend([
          new ZoomToExtent({
              extent: this.extentFromLonLat([ -79.0878, 42.7959, -78.4238, 43.1045 ])
          })
      ]).extend([attribution])
  });

    // Add the layer switcher from ol-layerswitcher 3rd party package to the map
    const layerSwitcher = new LayerSwitcher({});
    this.map.addControl(layerSwitcher);

    const select = new Select({
      hitTolerance: 5,
      multi: true,
      condition: singleClick,
      layers: [ this.vectorLayer ],
    });
    const popup = new PopupFeature({
      popupClass: 'default anim',
      select,
      canFix: true,
      template: {
        title: (feature) => 'BIN ' + feature.get('bin'),
        attributes: {
          aadt: { title: 'AADT' },
          year_of_aadt: { title: 'Year of AADT Estimate' },
          county_name: { title: 'County' },
          primary_owner: { title: 'Owning Jurisdiction' },
          primary_maintainer: { title: 'Maintenance Jurisdiction' },
          region: { title: 'NYSDOT Region' },
          common_name: { title: 'Common Name' },
          carried: { title: 'Carried Feature' },
          crossed: { title: 'Crossed Feature' },
          condition_field: {
            title: 'Condition Rating',
            format: (val: number) => val.toFixed(2)
          },
        }
      }
    });
    this.map.addInteraction(select);
    this.map.addOverlay(popup);

    const legend = new Legend({
      title: 'Bridge Marker Legend',
      style: selectAADTStyle,
      collapsible: true,
      margin: 5,
      size: [40, 10]
    });
    this.map.addControl(legend);

    legend.addRow();
    legend.addRow({ title: 'AADT < 235', properties: { aadt: 100 }, typeGeom: 'Point' });
    legend.addRow({ title: '235 < AADT <= 1005', properties: { aadt: 500 }, typeGeom: 'Point' });
    legend.addRow({ title: '1005 < AADT <= 3735', properties: { aadt: 2000 }, typeGeom: 'Point' });
    legend.addRow({ title: '3735 < AADT <= 11350', properties: { aadt: 5000 }, typeGeom: 'Point' });
    legend.addRow({ title: 'AADT > 11350', properties: { aadt: 12000 }, typeGeom: 'Point' });

    setTimeout(() => this.map.updateSize(), 200);

    // Bind to the map move end event. Update the URL query params.
    // Turn off overlay if zoom < 9 or turn it on if zooming in and it was forced off previously
    this.map.on('moveend', () => {
      this.updateUrl();

      const currentZoom = this.view.getZoom();
      const zoomChanged = currentZoom === this.zoom ? false : true;

      if (zoomChanged && currentZoom && currentZoom < 9) {
        this.vectorLayer.setVisible(false);
        this.forcedInvisible = true;
      } else if (zoomChanged && currentZoom && currentZoom >= 9 && this.forcedInvisible) {
        this.vectorLayer.setVisible(true);
        this.forcedInvisible = false;
      }
    });
    if (this.markerInput) {
      console.log('adding marker in init');
      this.addMarker(this.markerInput);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes.mapView) {
        this.updateView(changes.mapView.currentValue);
        setTimeout(() => this.map.updateSize(), 200);
      }
      if (changes.markerInput) {
        console.log('changes', changes);
        console.log('changes.markerInput.currentValue', changes.markerInput.currentValue);
        this.addMarker(changes.markerInput.currentValue);
      }
    }
  }

  ngOnDestroy() {
    if (this.bridgeObservable) {
      this.bridgeObservable.unsubscribe();
    }
  }

  updateView(view: { zoom: number; center: [number, number]; }) {
    if (this.map) {
      this.map.getView().setCenter(fromLonLat(view.center));
      this.map.getView().setZoom(view.zoom);
    }
  }

  updateUrl() {
    const view: View = this.map.getView();
    const center = toLonLat(view.getCenter());
    const zoom = Math.round(view.getZoom()); // Round zoom to an integer

    const queryParams = {
      lon: center[0].toFixed(4),
      lat: center[1].toFixed(4),
      z: zoom.toString()
    };

    this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams});
  }

  extentFromLonLat(extent: number[]) {
    const lowerLeft = extent.slice(0, 2);
    const upperRight = extent.slice(2, 4);
    return [ ...fromLonLat(lowerLeft), ...fromLonLat(upperRight) ];
  }

  extentToLonLat(extent: number[]): number[] {
    const lowerLeft = extent.slice(0, 2);
    const upperRight = extent.slice(2, 4);
    return [ ...toLonLat(lowerLeft), ...toLonLat(upperRight) ];
  }

  generateAADTStyles(): void {
    const rgbaValues = [
      [70, 40, 84],   // group0 colors
      [57, 86, 140],  // group1 colors
      [42, 150, 139], // group2 colors
      [115, 208, 85], // group3 colors
      [253, 231, 58]  // group4 colors
    ];
    const styles = rgbaValues.map((values) => {
      const fill = new Fill({
        color: `rgba(${values[0]}, ${values[1]}, ${values[2]}, 0.75)`
      });
      const stroke = new Stroke({
        color: 'rgba(0, 0, 0, 1)',
        width: 1.25
      });
      return [
        new Style({
          image: new Circle({
            fill,
            stroke,
            radius: 4
          }),
          fill,
          stroke
        })
      ];
    });
    this.styleGroups = {
      group0: styles[0],
      group1: styles[1],
      group2: styles[2],
      group3: styles[3],
      group4: styles[4],
    };
  }

  addMarker(markerIn: IMarker) {
    const lonLat = markerIn.lonLat;
    const props = markerIn.props;
    let title;
    if (markerIn.title) { title = markerIn.title; }

    // TODO: Create a class that handles each marker type (CurrentLocation, Search, BinSearch etc)
    // and exposes a VectorLayer, Select, and PopupFeature to add to the map
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: markerIn.src
      })
    });

    const feature = new Feature({
      type: 'icon',
      geometry: new Point(fromLonLat(lonLat))
    });
    feature.setStyle(iconStyle);

    if (title) {
      props.title = title;
    }
    feature.setProperties(props);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [ feature ],
      })
    });

    this.map.addLayer(vectorLayer);

    const select = new Select({
      hitTolerance: 5,
      multi: true,
      condition: singleClick,
      layers: [ vectorLayer ],
    });
    const popup = new PopupFeature({
      popupClass: 'default anim',
      select,
      canFix: true,
      template: {
        title: (f: Feature) => {
          if (f.get('title')) {
            return f.get('title') + ' Marker';
          } else {
            return 'Marker';
          }
        },
        attributes: {
          'Lat/Lon': { title: 'Lat/Lon' },
          Timestamp: {
            title: 'Timestamp',
            format: (time: number) => new Date(time).toLocaleTimeString()
          }
        }
      }
    });
    this.map.addInteraction(select);
    this.map.addOverlay(popup);
  }
}
