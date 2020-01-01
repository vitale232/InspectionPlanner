import { TPoint } from './markers.model';
import { TExtent } from './open-layers-map.model';

export type TLinearRing = TPoint[];

export interface IDriveTimePolygonFeature {
  id: number;
  type: string;
  geometry: {
    type: string;
    coordinates: TLinearRing[];
  };
  bbox: TExtent;
  properties: {
    created_time: Date;
    drive_time_query: 420;
  };
}
