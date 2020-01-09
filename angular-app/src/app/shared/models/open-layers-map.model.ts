/*
 * Developer WARNING: The OpenLayers code is not typed. See src/app/shared/components/open-layers-map.component.ts
 * for more details
 */

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { get as getProjection } from 'ol/proj';
import { Circle, Fill, Stroke, Style } from 'ol/style';

import { IDriveTimePolygonFeature } from './drive-time-polygons.model';
import { IColormapQueryParams, IColormapStats, IColormapCuts, IColormap } from './map-settings.model';


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
          color: [ 237, 28, 36, 1 ], // Malta Ridge Red
          width: 1.5
        })
      })
    });

  }
}

export class StyleFactory {

  public inputParams: IColormapQueryParams;
  public stats: IColormapStats;
  public cuts: IColormapCuts;
  public alpha: number;
  public rgba: string;

  constructor(colormap: IColormap, alpha: number = 0.9) {
    this.inputParams = colormap.input_params;
    this.stats = colormap.stats;
    this.cuts = colormap.cuts;
    this.alpha = alpha;
  }

  public styleFeature(feature) {
    const dataValue = feature.get(this.inputParams.field);
    if (!dataValue) {
      const noDataFill = new Fill({ color: 'rgba(0, 0, 0, 1)'});
      const noDataStroke = new Stroke({ color: 'rgba(0, 0, 0, 1)', width: 1.25 });
      return new Style({ image: new Circle({ noDataFill, noDataStroke, radius: 4}), noDataFill, noDataStroke });
    }
    // const dataValue = feature;
    const index = this.cuts.closed === 'right'
                ? this.cuts.intervals.findIndex((cuts) => dataValue > cuts[0] && dataValue <= cuts[1])
                : this.cuts.intervals.findIndex((cuts) => dataValue >= cuts[0] && dataValue < cuts[1]);

    const colors = this.cuts.rgb_colors[index];
    this.rgba = `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${this.alpha})`;

    // return this.rgba;
    const fill = new Fill({ color: this.rgba });
    const stroke = new Stroke({ color: 'rgba(0, 0, 0, 1)', width: 1.25 });

    return new Style({ image: new Circle({ fill, stroke, radius: 4}), fill, stroke });
  }

}
