import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IGeoPosition } from '../models/geolocation.model';

@Injectable({
  providedIn: 'root'
})
export class GeolocationStoreService {

  private readonly _position = new BehaviorSubject<IGeoPosition>( null );
  readonly position$ = this._position.asObservable();

  set position(val: IGeoPosition) {
    this._position.next(val);
  }

  get position(): IGeoPosition {
    this.fetchPosition();
    return this._position.getValue();
  }

  constructor() { }

  private fetchPosition(): void {
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
        console.error('TODO: Do something with this error', err);
        this._position.error(err);
      }
    );
  }
}
