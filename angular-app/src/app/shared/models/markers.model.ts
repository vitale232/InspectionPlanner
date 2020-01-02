/*
 * Developer WARNING: The OpenLayers code is not typed. See src/app/shared/components/open-layers-map.component.ts
 * for more details
 */

import { INominatimApiResponse } from './nominatim-api.model';

import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select';
import { singleClick } from 'ol/events/condition';
import Point from 'ol/geom/Point';

import PopupFeature from 'ol-ext/overlay/PopupFeature';
import { IGeoPosition } from './geolocation.model';
import { IDriveTimeQueryFeature } from './drive-time-queries.model';


export type TPoint = [ number, number ];

export interface ISearchMarkerProps extends INominatimApiResponse {
  title ?: string;
}

/*
 * Set up a base Marker class. Three Marker class types will inherit the base Marker class:
 * SearchMarker, GeolocationMarker, and DriveTimeMarker. These three classes will have
 * OpenLayers details regarding the construction of the different marker types and displaying
 * their attributes
 */

export class Marker {

  lonLat: TPoint;
  src: string;
  title: string;
  iconStyle: Icon;
  feature: Feature;
  props: ISearchMarkerProps | IGeoPosition | IDriveTimeQueryFeature['properties'];
  layer: VectorLayer;
  popup: PopupFeature;
  select: Select;

  constructor(
    lonLat: TPoint,
    src: string,
    title: string,
  ) {
    this.lonLat = lonLat;
    this.src = src;
    this.title = title;

  }

  initMapMarker(): void {
    this.iconStyle = new Style({ image: new Icon({ anchor: [ 0.5, 1.0 ], src: this.src }) });

    this.feature = new Feature({ type: 'icon', geometry: new Point( fromLonLat(this.lonLat) ) });
    this.feature.setStyle(this.iconStyle);

    // Set up search marker specific OpenLayers stuff
    this.feature.setProperties(this.props);

    this.layer = new VectorLayer({
      source: new VectorSource({ features: [ this.feature ] }),
      title: this.title
    });

    this.select = new Select({
      hitTolerance: 5,
      multi: true,
      condition: singleClick,
      layers: [ this.layer ],
    });

    this.popup = new PopupFeature({
      popupClass: 'default-anim',
      select: this.select,
      canFix: true,
      // TODO: Get popup feature attributes sorted out
      template: {
        title: (f: Feature) => {
          if (f.get('title')) {
            return f.get('title');
          } else {
            return 'Marker';
          }
        },
      }
    });

  }

}


/*
 * The SearchMarker class refers to a Nominatim API georeference search. These are
 * instantiated from the user input in the app-omni-search-form component, when the
 * searchText provides a response when used to query Nominatim.
 */
export class SearchMarker extends Marker {

  props: ISearchMarkerProps;
  popup: PopupFeature;
  select: Select;

  constructor(
      lonLat: TPoint,
      apiResponse: INominatimApiResponse,
      title ?: string,
    ) {
      super(
        lonLat,
        'assets/marker-icon-red.png', // Default marker source for search markers
        'Search Marker'               // Default title
      );

      // Bind the API data to the object
      this.props = apiResponse;
      if (title) { this.title = title; this.props.title = title; }

      super.initMapMarker();
  }

}

export class GeolocationMarker extends Marker {

  props: IGeoPosition;

  constructor(
    lonLat: TPoint,
    geolocation: IGeoPosition,
    title ?: string
  ) {
    super(
      lonLat,
      'assets/marker-icon-black.png',
      'Geolocation Marker'
    );

    this.props = geolocation;
    if (title) { this.title = title; this.props.title = title; }

    super.initMapMarker();
  }
}

export class DriveTimeQueryMarker extends Marker {

  props: IDriveTimeQueryFeature['properties'];

  constructor(
    lonLat: TPoint,
    driveTimeQueryProps: IDriveTimeQueryFeature['properties'],
    title ?: string
  ) {
    super(
      lonLat,
      'assets/marker-icon-violet.png',
      'Drive Time Start Point Marker'
    );

    this.props = driveTimeQueryProps;
    if (title) { this.title = title; this.props.title = title; }

    super.initMapMarker();
  }

}