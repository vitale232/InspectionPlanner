export interface INewDriveTimeParms {
  q: string;
  drive_time_hours: string;
  return_bridges: boolean;
}

export interface IDriveTimeQueryApiResponse {
  count: number;
  next: string|null;
  previous: string|null;
  results: {
    type: string;
    features: Array<IDriveTimeQueryFeature>
  };
}

export interface IDriveTimeQueryFeature {
  id: number;
  type: string;
  geometry: {
    type: string;
    coordinates: number[];
  };
  bbox: Array<number>;
  properties: {
    search_text: string;
    place_id: number;
    osm_id: number;
    bounding_box: Array<number>;
    lat: number;
    lon: number;
    display_name: string;
    osm_class: string;
    osm_type: string;
    importance: number;
    created_time: Date;
    edited_time: Date;
    drive_time_hours: number;
    polygon_pending: boolean;
  };
}

export interface ISubmittedDriveTimeQuery {
  msg: string;
  search_text: string;
  drive_time_hours: string;
  return_bridges: boolean;
  inspection_years: number;
  lat: string;
  lon: string;
  display_name: string;
}

export type DriveTimeEndpoint = IDriveTimeQueryFeature|ISubmittedDriveTimeQuery;

export interface IQueryProperties {
  drive_time_hours: number;
  display_name: string;
  id: number;
  lat: number;
  lon: number;
  polygon_pending: boolean;
  search_text: string;
}
