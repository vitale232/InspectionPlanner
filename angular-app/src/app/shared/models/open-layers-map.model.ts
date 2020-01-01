/*
 * Developer WARNING: The OpenLayers code is not typed. See src/app/shared/components/open-layers-map.component.ts
 * for more details
 */

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { get as getProjection } from 'ol/proj';
import { Fill, Stroke, Style } from 'ol/style';

import { IDriveTimePolygonFeature } from './drive-time-polygons.model';


export interface IMapView {
  zoom: number;
  center: [number, number];
}

export interface IStyleStoreAADT {
  group0: Style[];
  group1: Style[];
  group2: Style[];
  group3: Style[];
  group4: Style[];
}

export interface IMarker {
  lonLat: [number, number];
  src: string;
  props: any;
  title?: string;
}

export type TExtent = [ number, number, number, number ];

/*
* The IExtent interface represents an array of 4 numbers: [ xmin, xmax, ymin, ymax ]
*/
export interface IExtent {
  0: number;
  1: number;
  2: number;
  3: number;
}

export class DriveTimePolygon {

  source: VectorSource;
  layer: VectorLayer;

  constructor(driveTimePolygon: IDriveTimePolygonFeature) {

    this.source = new VectorSource({
      features: new GeoJSON({
        featureProjection: getProjection('EPSG:3857'),
      }).readFeatures(driveTimePolygon)
    });

    this.layer = new VectorLayer({
      source: this.source,
      title: 'Drive Time Polygon',
      style: new Style({
        fill: new Fill({
          color: [ 192, 22, 0, 0 ], // Last zero means transparent
        }),
        stroke: new Stroke({
          // color: [ 192, 22, 0, 1 ], // Dark red
          // color: [ 0, 136, 203, 1], // Light blue
          color: [ 237, 28, 36, 1 ], // Malta Ridge Red
          width: 1.5
        })
      })
    });

  }
}
