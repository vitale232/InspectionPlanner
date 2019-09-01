import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MapExtent } from '../models/map-tools.model';
import { LocationSearchResult } from '../models/location-search.model';

@Injectable({
  providedIn: 'root'
})
export class MapToolsService {
  mapHome = new Subject<MapExtent>();
  clearMarkers = new Subject<boolean>();

  constructor() { }

  sendMapHome(extent: MapExtent): void {
    this.mapHome.next(extent);
  }

  getMapHome$(): Observable<MapExtent> {
    return this.mapHome.asObservable();
  }

  sendClearMarkers(bool: boolean): void {
    this.clearMarkers.next(bool);
  }

  getClearMarkers$(): Observable<boolean> {
    return this.clearMarkers.asObservable();
  }
}
