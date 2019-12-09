import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MapExtent } from '../models/map-tools.model';
import { LocationSearchResult } from '../models/location-search.model';
import { NewYorkBridgeFeature } from '../models/new-york-bridges.model';

@Injectable({
  providedIn: 'root'
})
export class MapToolsService {
  mapHome = new Subject<MapExtent>();
  clearMarkers = new Subject<boolean>();
  clearGridMarkersSubject = new Subject<boolean>();
  gridBinSubject = new Subject<NewYorkBridgeFeature>();

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

  gridBinClick(feature: NewYorkBridgeFeature): void {
    this.gridBinSubject.next(feature);
  }

  getBinClick$(): Observable<NewYorkBridgeFeature> {
    return this.gridBinSubject.asObservable();
  }

  getClearGridBinMarker$(): Observable<boolean> {
    return this.clearGridMarkersSubject.asObservable();
  }

  sendClearGridBinMarkers(val: boolean): void {
    this.clearGridMarkersSubject.next(val);
  }
}
