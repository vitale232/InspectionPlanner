export interface NominatimApiResponse {
    boundingbox: Array<string|number>;
    class: string;
    display_name: string;
    importance: number;
    lat: string|number;
    licence: string;
    lon: string|number;
    osm_id: number;
    osm_type: string;
    place_id: string|number;
    type: string;
}

export interface LocationSearchResult {
    lat: string;
    lon: string;
    z: number;
    displayName: string;
    class: string;
    type: string;
    osmType: string;
}
