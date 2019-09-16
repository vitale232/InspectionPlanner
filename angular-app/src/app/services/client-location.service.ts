import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ClientLocation } from '../models/location-search.model';
import { NotificationsService } from 'angular2-notifications';
import { SidenavService } from './sidenav.service';

@Injectable({
  providedIn: 'root'
})
export class ClientLocationService {
  clientLocation = new Subject<ClientLocation>();

  constructor(
    private notifications: NotificationsService,
    private sidenav: SidenavService
  ) { }

  queryClientLocation(): void {
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
        this.sidenav.close();
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

  sendClientLocation(location: ClientLocation): void {
    this.clientLocation.next(location);
  }

  getClientLocation$(): Observable<ClientLocation> {
    return this.clientLocation.asObservable();
  }
}