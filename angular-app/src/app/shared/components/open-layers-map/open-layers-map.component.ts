/* Warning: This portion of the application does not use TypeScript. Getting
* full fledged TypeScript support is an open issue with OpenLayers. See this
* link: https://github.com/openlayers/openlayers/pull/9178
* About halfway through the discussion, the conflicts between OpenLayers current
* TypeScript support and the rest of the Angular app are discussed.
* Until TypeScript is well supported in OL 6, this file will be vanilla JavaScript.\
* Fortunately, the OpenLayers API is well documented using JsDoc here:
* https://openlayers.org/en/latest/apidoc/
* Just search for the object you're using, and you essentially get type info.
* */


import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMapView, IStyleStoreAADT, TExtent, DriveTimePolygon } from 'src/app/shared/models/open-layers-map.model';
import { IBridgeFeature } from '../../models/bridges.model';
import { SearchMarker, GeolocationMarker } from '../../models/markers.model';

import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Fill, Stroke, Circle, Style } from 'ol/style';
import { get as getProjection } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Subscription, Observable } from 'rxjs';
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

import PopupFeature from 'ol-ext/overlay/PopupFeature';
import Legend from 'ol-ext/control/Legend';
import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import { IDriveTimePolygonFeature } from '../../models/drive-time-polygons.model';
import { IGeoPosition } from '../../models/geolocation.model';


@Component({
  selector: 'app-open-layers-map',
  templateUrl: './open-layers-map.component.html',
  styleUrls: ['./open-layers-map.component.scss']
})
export class OpenLayersMapComponent implements OnInit, OnChanges, OnDestroy {

  // Component inputs
  // driveTimePolygon$ is optional. If there is data, it will draw the polygon
  @Input() mapView: IMapView;
  @Input() loading$: Observable<boolean>;
  @Input() bridges$: Observable<IBridgeFeature[]>;
  @Input() searchMarkers$: Observable<SearchMarker[]>;
  @Input() position$: Observable<IGeoPosition>;
  @Input() driveTimePolygons$: Observable<IDriveTimePolygonFeature>; // Optional

  // Component events
  @Output() bbox = new EventEmitter<TExtent>();

  // OpenLayers objects
  public map: Map;
  private view: View;
  private resolution: number;
  private vectorLayer: VectorLayer;
  private markerVectorLayers: VectorLayer[] = [];
  private zoom: number;

  // Custom behaviors
  private styleGroups: IStyleStoreAADT;
  private overlayGroup: Group;
  private bridgeSubscription: Subscription;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // this.updateUrl gets called during init, so if no mapView was passed in, the URL params
    // will include NaN values, which breaks the map until they're deleted from the URL. Let's
    // test for NaNs, and force the map to Albany if there are any
    if (!this.mapView || [ this.mapView.zoom, ...this.mapView.center ].some(x => Number.isNaN(x))) {
      this.mapView = { zoom: 10, center: [ -74.0234, 42.8337 ] };
    }
    this.zoom = this.mapView.zoom;
    this.view = new View({
      center: fromLonLat(this.mapView.center),
      zoom: this.zoom,
    });

    const vectorSource = new VectorSource({
      format: new GeoJSON({
        featureProjection: getProjection('EPSG:3857'),
      }),
      strategy: (extent: TExtent, resolution: number): TExtent[] => {
        // The default bbox strategy doesn't quite fit our needs. Default bbox will cache extents,
        // and forces download of all features for the largest extent encountered. This means that if you
        // zoom out to the entire state, find Rochester, then zoom in on Rochester, the data will not display
        // until the entire state has loaded. Since the entire state is time prohibitive, we'll force reload
        // every time the resolution changes.
        if (this.resolution && this.resolution !== resolution) {
          if (this.bridgeSubscription) { this.bridgeSubscription.unsubscribe(); }
          vectorSource.loadedExtentsRtree_.clear();
        }
        return [ extent ];
      },
      loader: (extent: TExtent, res: number) => {
        this.resolution = res;
        if (this.bridgeSubscription) { this.bridgeSubscription.unsubscribe(); }
        // Data fetching is triggered by the bbox output event. The bbox output
        // is emitting new values when a map move event ends. The parent component
        // of .this component must call fetchBridges(bbox) in the bridge store
        // when .this component emits a bbox event. By subscribing to the bridges$
        // observable in the loader, we'll be reacting to reception of new data by
        // replacing the vectorSource features
        this.bridgeSubscription = this.bridges$.subscribe(
          (bridges: IBridgeFeature[]) => {
            vectorSource.clear();
            vectorSource.addFeatures(vectorSource.getFormat().readFeatures({
              type: 'FeatureCollection',
              features: bridges
            }));
          },
          (err) => console.error('error from loader', err),
          () => setTimeout(() => this.map.updateSize(), 200)
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

    const studyAreaVectorSource = new VectorSource({
      features: [
        new Feature({
          geometry: new Polygon([[               // Note array depth
            fromLonLat( [ -78.3377, 41.5679 ] ), // Same as last point
            fromLonLat( [ -72.7328, 41.5679 ] ),
            fromLonLat( [ -72.7328, 44.2841 ] ),
            fromLonLat( [ -78.3377, 44.2841 ] ),
            fromLonLat( [ -78.3377, 41.5679 ] ), // Same as first point
          ]])
        })
      ]
    });

    const studyAreaVectorLayer = new VectorLayer({
      source: studyAreaVectorSource,
      title: 'Routable Network Extent',
      type: 'overlay',
      visible: true,
      style: new Style({
        fill: new Fill({
          color: [ 255, 0, 0, 0 ]
        }),
        stroke: new Stroke({
          color: [0, 31, 204, 1],
          width: 1.5
        })
      })
    });

    this.overlayGroup = new Group({
        title: 'Overlays',
        layers: [ studyAreaVectorLayer, this.vectorLayer ]
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
                    'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
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
      layers: [ basemapGroup, this.overlayGroup, ],
      view: this.view,
      controls: defaultControls( { attribution: false } ).extend([
          new ZoomToExtent({
              extent: this.extentFromLonLat([ -78.4, 41.5679, -72.65, 44.2841 ])
          })
      ]).extend([attribution])
  });

  // Add the layer switcher from ol-layerswitcher 3rd party package to the map
    const layerSwitcher = new LayerSwitcher();
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

    this.map.on('moveend', () => {
      // To satisfy TypeScript, calculate the extent then unpack it before emitting as an event. This
      // allows TS to know the definitive shape of the extent matches the Tuple Type definitions
      const boundingBox = this.extentToLonLat( this.map.getView().calculateExtent() );
      this.bbox.emit( [ boundingBox[0], boundingBox[1], boundingBox[2], boundingBox[3] ] );
      this.updateUrl();
    } );

    if (this.searchMarkers$) {
      this.subscriptions.add(this.searchMarkers$.subscribe(
        (data: SearchMarker[]) => {
          console.log('searchMarkers data from OLM', data);
          if (data.length === 0) { this.clearMarkers(); } else { this.addMarkers(data); }
        },
        (err) => console.error('this.searchMarkers$ subscribe error', err),
      ));
    }

    if (this.position$) {
      this.subscriptions.add(this.position$.subscribe(
        (geoPosition: IGeoPosition) => {

          if (geoPosition) {
            this.addGeolocationMarker(geoPosition);
          }
        }
      ));
    }

    // TODO: Draw the polygon on the map
    if (this.driveTimePolygons$) {
      this.subscriptions.add(this.driveTimePolygons$.subscribe(
        driveTimeFeature => {
          if (driveTimeFeature) {
            this.addDriveTimePolygon(driveTimeFeature);
          }
        },
        err => console.error(err),
      ));
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes.mapView) {
        this.updateView(changes.mapView.currentValue);
        setTimeout(() => this.map.updateSize(), 100);
      }
    }
  }

  ngOnDestroy() {
    if (this.bridgeSubscription) {
      this.bridgeSubscription.unsubscribe();
    }
    this.subscriptions.unsubscribe();
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

    if (Object.values(queryParams).some((x: string) => Number.isNaN(parseFloat(x)))) {
      return; // Return without updating URL if there are any NaNs
    } else {
      this.router.navigate(['.'], { relativeTo: this.activatedRoute, queryParams});
    }
  }

  extentFromLonLat(extent: TExtent): TExtent {
    const lowerLeft = extent.slice(0, 2);
    const upperRight = extent.slice(2, 4);
    const returnExtent = [ ...fromLonLat(lowerLeft), ...fromLonLat(upperRight) ];
    return [ returnExtent[0], returnExtent[1], returnExtent[2], returnExtent[3] ];
  }

  extentToLonLat(extent: TExtent): TExtent {
    const lowerLeft = extent.slice(0, 2);
    const upperRight = extent.slice(2, 4);
    const returnArray = [ ...toLonLat(lowerLeft), ...toLonLat(upperRight) ];
    return [ returnArray[0], returnArray[1], returnArray[2], returnArray[3] ];
  }

  generateAADTStyles(): void {
    const rgbaValues = [
      [70, 40, 84],   // group0 colors
      [57, 86, 140],  // group1 colors
      [42, 150, 139], // group2 colors
      [115, 208, 85], // group3 colors
      [253, 231, 58]  // group4 colors
    ];
    const styles = rgbaValues.map((rgba) => {
      const fill = new Fill({ color: `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, 0.75)` });
      const stroke = new Stroke({ color: 'rgba(0, 0, 0, 1)', width: 1.25 });
      return [ new Style({ image: new Circle({ fill, stroke, radius: 4 }), fill, stroke }) ];
    });
    this.styleGroups = {
      group0: styles[0],
      group1: styles[1],
      group2: styles[2],
      group3: styles[3],
      group4: styles[4],
    };
  }

  addMarkers(markersIn: SearchMarker[]|GeolocationMarker[]) {
    markersIn.forEach((marker: SearchMarker|GeolocationMarker) => {

      this.map.addInteraction(marker.select);
      this.map.addOverlay(marker.popup);
      this.markerVectorLayers.push(marker.layer);

      const mapLayers = this.map.getLayers();

      // Only add layers that are not duplicates
      this.markerVectorLayers.forEach(layer => {
        if (!mapLayers.getArray().includes(layer)) {
          this.map.addLayer(layer);
        }
      });

    });

    // Center on the last search marker in the input array
    if (markersIn.length > 0) {
      this.map.getView().setCenter( fromLonLat(markersIn[markersIn.length - 1].lonLat) );
      this.map.getView().setZoom( 14 );
    }

  }

  addGeolocationMarker(geoPosition: IGeoPosition): void {
    this.addMarkers([
      new GeolocationMarker(
        [ geoPosition.lon, geoPosition.lat ],
        geoPosition,
        'Current Location Marker',
      )
    ]);
    // const mapLayers = this.map.getLayers();

    // // Only add layers that are not duplicates
    // if (!mapLayers.getArray().includes(geoMarker.vectorLayer)) {
    //   this.map.addInteraction(geoMarker.select);
    //   this.map.addOverlay(geoMarker.popup);
    //   this.map.addLayer(geoMarker.vectorLayer);
    // }

    // this.map.getView().setCenter( fromLonLat( [ geoPosition.lon, geoPosition.lat ] ) );
    // this.map.getView().setZoom( 14 );
  }

  addDriveTimePolygon(driveTimeFeature: IDriveTimePolygonFeature): void {
    const mapLayers = this.map.getLayers();

    mapLayers.getArray().forEach((layer: VectorLayer) => {
      if (layer.get('title') === 'Drive Time Polygon') {
        this.map.removeLayer(layer);
      }
    });

    const polygon = new DriveTimePolygon(driveTimeFeature);

    if (!mapLayers.getArray().includes(polygon.layer)) { this.map.addLayer(polygon.layer); }

  }

  clearMarkers() {
    this.markerVectorLayers.forEach(layer => this.map.removeLayer(layer));
    this.markerVectorLayers = [];
  }

  onButton() {
    this.clearMarkers();
  }

  updateMapSize() {
    if (this.map) {
      setTimeout(() => this.map.updateSize(), 200);
    }
  }
}
