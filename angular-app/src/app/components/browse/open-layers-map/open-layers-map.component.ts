import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';

import Map from 'ol/Map';
import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import { buffer } from 'ol/extent';
import {Fill, Stroke, Circle, Style} from 'ol/style';
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

import LayerSwitcher from 'ol-layerswitcher';
import PopupFeature from 'ol-ext/overlay/PopupFeature';
import { IMapView, IStyleStoreAADT } from 'src/app/models/open-layers-map.model';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-open-layers-map',
  templateUrl: './open-layers-map.component.html',
  styleUrls: ['./open-layers-map.component.css']
})
export class OpenLayersMapComponent implements OnInit, OnChanges {

  @Input() mapView: IMapView;

  private map: Map;
  private zoom: number;
  private forcedInvisible: boolean;
  private view: View;
  private styleGroups: IStyleStoreAADT;
  private bridgeObservable: Subscription;
  private resolution: number;
  private vectorLayer: VectorLayer;

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
      extent: buffer(this.extentFromLonLat( [ -80.541, 40.305, -69.917, 45.252 ]), 100000),
    });

    const vectorSource = new VectorSource({
      format: new GeoJSON({
        featureProjection: getProjection('EPSG:3857'),
      }),
      strategy: (extent: number[], resolution: number) => {
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
          }
        );
      },
    });

    this.generateAADTStyles();
    this.vectorLayer = new VectorLayer({
      source: vectorSource,
      title: 'New York Bridges',
      type: 'overlay',
      visible: true,
      style: (f) => {
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
      }
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
              extent: this.extentFromLonLat([ -74.5313, 41.9309, -71.8753, 43.1731 ])
          })
      ]).extend([attribution])
  });

    // Add the layer switcher from ol-layerswitcher 3rd party package to the map
    const layerSwitcher = new LayerSwitcher({});
    this.map.addControl(layerSwitcher);

    const select = new Select({
      hitTolerance: 5,
      multi: true,
      condition: singleClick
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
            format: (val, feature) => (feature.get('condition_field')).toFixed(2)
          },
        }
      }
    });
    this.map.addInteraction(select);
    this.map.addOverlay(popup);

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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mapView) {
      this.updateView(changes.mapView.currentValue);
      setTimeout(() => this.map.updateSize(), 200);
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
    const zoom = parseInt(view.getZoom().toString(), 10); // Round zoom to an integer

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
}
