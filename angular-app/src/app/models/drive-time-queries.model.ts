export interface DriveTimeQueryApiResponse {
  count: number;
  next: string|null;
  previous: string|null;
  results: {
    type: string;
    features: Array<DriveTimeQueryFeature>
  };
}

export interface DriveTimeQueryFeature {
  id: number;
  type: string;
  coordinates: Array<number>;
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
  };
}
