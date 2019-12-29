export interface INominatimApiResponse {
  boundingbox: Array<string|number>;
  class: string;
  display_name: string;
  importance: number;
  lat: string;
  licence: string;
  lon: string;
  osm_id: number;
  osm_type: string;
  place_id: string|number;
  type: string;
}
