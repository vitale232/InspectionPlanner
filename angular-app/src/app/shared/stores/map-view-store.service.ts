import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMapView } from '../models/open-layers-map.model';

@Injectable({
  providedIn: 'root'
})
export class MapViewStoreService {

  private readonly _mapView = new BehaviorSubject<IMapView>( { zoom: 10, center: [ -74.0234, 42.8337 ] } );
  readonly mapView$ = this._mapView.asObservable();

  get mapView(): IMapView {
    return this._mapView.getValue();
  }

  set mapView(val: IMapView) {
    this._mapView.next(val);
  }

  constructor() { }
}
