export interface NewYorkBridgesApiResponse {
  count: number;
  next: string|null;
  previous: string|null;
  results: {
    type: string;
    features: Array<NewYorkBridgeFeature>
  };
}

export interface NewYorkBridgeFeature {
  id: number;
  type: string;
  coordinates: Array<number>;
  bbox: Array<number>;
  properties: {
    bin: string;
    common_name: string;
    local_bridge: string;
    region: string;
    county_name: string;
    political_field: string;
    carried: string;
    crossed: string;
    crossed_mi: string;
    crossed_to: string;
    location: string;
    latitude: number;
    longitude: number;
    primary_owner: string;
    primary_maintainer: string;
    condition_field: number;
    inspection: string;
    bridge_length: number;
    curb_to_curb: number;
    deck_area_field: number;
    aadt: number;
    year_of_aadt: number;
    gtms_mater: string;
    gtms_structure: string;
    year_built: number;
    posted_load: number;
    restricted: number;
    r_posted: string;
    other: number;
    other_post: string;
    posted_leg: string;
    posting_co: number;
    total_hz_c: number;
    total_hz_1: number;
    posted_vrt: number;
    posted_v_1: number;
    state_owned: string;
    permitted_field: number;
    permitted_1: number;
    carried_la: string;
    created_time: Date;
    edited_time: Date;
  };
}