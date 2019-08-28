import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MapExtent } from '../models/map-tools.model';

@Injectable({
  providedIn: 'root'
})
export class MapToolsService {
  mapHome = new Subject();

  constructor() { }

  sendMapHome(extent: MapExtent) {
    this.mapHome.next(extent);
  }

  getMapHome$() {
    return this.mapHome.asObservable();
  }
}
