import Style from 'ol/style';

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
