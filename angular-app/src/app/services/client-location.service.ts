import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClientLocation } from '../models/location-search.model';

@Injectable({
  providedIn: 'root'
})
export class ClientLocationService {
  clientLocation$ = new Subject();

  constructor() { }

  queryClientLocation() {
    navigator.geolocation.getCurrentPosition(pos => {
      this.sendClientLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        timestamp: pos.timestamp
      });
    });
  }

  sendClientLocation(location: ClientLocation) {
    this.clientLocation$.next(location);
  }

  getClientLocation() {
    return this.clientLocation$.asObservable();
  }
}
