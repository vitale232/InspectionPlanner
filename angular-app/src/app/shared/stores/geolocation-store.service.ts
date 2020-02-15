import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGeoPosition } from '../models/geolocation.model';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GeolocationStoreService {

  private readonly _position = new BehaviorSubject<IGeoPosition>( null );
  readonly position$ = this._position.asObservable();

  set position(val: IGeoPosition) {
    this.router.navigate(['.'], { queryParams: {
      lon: val.lon,
      lat: val.lat,
      z: 14
    }});
    this._position.next(val);
  }

  get position(): IGeoPosition {
    this.fetchPosition();
    return this._position.getValue();
  }

  constructor(
    private notifications: NotificationsService,
    private router: Router,
    ) { }

  public fetchPosition(): void {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.position = {
          lon: pos.coords.longitude,
          lat: pos.coords.latitude,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          timestamp: pos.timestamp,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
        };
      },
      (err) => {
        this.notifications.error(
          'Geolocation Error',
          err.message
        );
        this._position.error(err);
      }
    );
  }
}
