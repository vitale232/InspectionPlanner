import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MapExtent } from '../models/map-tools.model';

@Injectable({
  providedIn: 'root'
})
export class MapToolsService {
  mapHome = new Subject();
  clearMarkers = new Subject();

  constructor() { }

  sendMapHome(extent: MapExtent) {
    this.mapHome.next(extent);
  }

  getMapHome$() {
    return this.mapHome.asObservable();
  }

  sendClearMarkers(bool: boolean) {
    this.clearMarkers.next(bool);
  }

  getClearMarkers$() {
    return this.clearMarkers.asObservable();
  }
}
