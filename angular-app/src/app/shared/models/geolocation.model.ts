export interface IGeoPosition {
    lon: number;
    lat: number;
    altitude: number;
    altitudeAccuracy: number;
    timestamp: number;
    accuracy ?: number;
    heading ?: any;
    speed ?: any;
    title ?: string;
}
