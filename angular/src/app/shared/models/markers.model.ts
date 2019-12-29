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


export class SearchMarker extends Marker {

  props: ISearchMarkerProps;
  vectorLayer: VectorLayer;
  popup: PopupFeature;
  select: Select;

  constructor(
    lonLat: TPoint,
    apiResponse: INominatimApiResponse
    ) {

    super(
      lonLat,
      'assets/marker-icon-red.png', // Default marker source for search markers
      'Search Marker'               // Default title
    );

    // Bind the API data to the object
    this.props = apiResponse;
    this.props.title = this.title;

  }

  addToMap(map: Map): Map {
    map.addInteraction(this.select);
    map.addOverlay(this.popup);
    return map;
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
