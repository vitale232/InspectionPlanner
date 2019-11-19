export interface NominatimApiResponse {
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

export interface LocationSearchResult {
    lat: string;
    lon: string;
    z: number;
    displayName: string;
    class: string;
    type: string;
    osmType: string;
}

export interface ClientLocation {
    lat: number;
    lon: number;
    timestamp: number;
}

export interface FilterSearch {
    streetAddress: string;
    city: string;
    state: string;
    country: string;
}

export interface ILatLon {
    lat: number;
    lon: number;
}

export interface IStorageLocation {
    latLon: ILatLon;
    html: string;
    bin?: string;
}

export class MarkerStore {
    constructor(
        public locationSearch: IStorageLocation[],
        public clientLocation: IStorageLocation,
        public binLocations: IStorageLocation[],
    ) {}
}
