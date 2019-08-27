import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ClientLocation } from '../models/location-search.model';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ClientLocationService {
  clientLocation$ = new Subject();

  constructor(
    private notifications: NotificationsService,
  ) { }

  queryClientLocation() {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000
    };
    navigator.geolocation.getCurrentPosition(
      pos => {
        const clientLocation: ClientLocation = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          timestamp: pos.timestamp
        };
        this.sendClientLocation(clientLocation);
    }, err => {
      this.notifications.error(
        `Geolocation error`,
        `${err.message}`, {
          timeOut: 20000,
          showProgressBar: true,
          pauseOnHover: true,
          clickToClose: true
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
