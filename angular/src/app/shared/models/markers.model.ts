/*
 * Developer WARNING: The OpenLayers code is not typed. See src/app/shared/components/open-layers-map.component.ts
 * for more details
 */

import { INominatimApiResponse } from './nominatim-api.model';

import Map from 'ol/Map';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select';
import { singleClick } from 'ol/events/condition';
import Point from 'ol/geom/Point';

import PopupFeature from 'ol-ext/overlay/PopupFeature';


export type TPoint = [ number, number ];

export interface ISearchMarkerProps extends INominatimApiResponse {
  title?: string;
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

  constructor(
    lonLat: TPoint,
    src: string,
    title: string,
  ) {
    this.lonLat = lonLat;
    this.src = src;
    this.title = title;

  }

}


/*
 * The SearchMarker class refers to a Nominatim API georeference search. These are
 * instantiated from the user input in the app-omni-search-form component, when the
 * searchText provides a response when used to query Nominatim.
 */
export class SearchMarker extends Marker {

  props: ISearchMarkerProps;
  vectorLayer: VectorLayer;
  popup: PopupFeature;
  select: Select;

  constructor(
    lonLat: TPoint,
    apiResponse: INominatimApiResponse,
    title?: string,
    ) {
    console.log('title', title);
    super(
      lonLat,
      'assets/marker-icon-red.png', // Default marker source for search markers
      'Search Marker'               // Default title
    );

    if (title) { this.title = title; }
    // Bind the API data to the object
    this.props = apiResponse;
    this.props.title = this.title;
    this.initMapMarker();

  }

  initMapMarker(): void {
    this.iconStyle = new Style({
      image: new Icon({
        anchor: [ 0.5, 1.0 ],
        src: this.src
      })
    });

    this.feature = new Feature({
      type: 'icon',
      geometry: new Point( fromLonLat(this.lonLat) ),
    });
    this.feature.setStyle(this.iconStyle);

    // Set up search marker specific OpenLayers stuff
    this.feature.setProperties(this.props);

    this.vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [ this.feature ],
      })
    });

    this.select = new Select({
      hitTolerance: 5,
      multi: true,
      condition: singleClick,
      layers: [ this.vectorLayer ],
    });

    this.popup = new PopupFeature({
      popupClass: 'default-anim',
      select: this.select,
      canFix: true,
      template: {
        title: (f: Feature) => {
          if (f.get('title')) {
            return f.get('title');
          } else {
            return 'Marker';
          }
        }
      },
      attributes: {
        display_name: { title: 'Address' },
         lonLat: {
           title: 'Lat/Lon',
           format: (xyPoint: TPoint) => `${xyPoint[0].toFixed(4)}, ${xyPoint[1].toFixed(4)}`
         }
      }
    });

  }

}
