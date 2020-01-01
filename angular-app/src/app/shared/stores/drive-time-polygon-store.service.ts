import { Injectable } from '@angular/core';
import { IDriveTimePolygonFeature } from '../models/drive-time-polygons.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { BridgesStoreService } from './bridges-store.service';
import { DriveTimePolygonService } from '../services/drive-time-polygon.service';

@Injectable({
  providedIn: 'root'
})
export class DriveTimePolygonStoreService {
  // This store is dependent on the BridgeStore, which is the definitive
  // source of the driveTimeID

  private readonly _driveTimePolygon = new BehaviorSubject<IDriveTimePolygonFeature>( null );
  readonly driveTimePolygon$ = this._driveTimePolygon.asObservable();

  get driveTimePolygon(): IDriveTimePolygonFeature {
    return this._driveTimePolygon.getValue();
  }

  set driveTimePolygon(val: IDriveTimePolygonFeature) {
    this._driveTimePolygon.next(val);
  }

  constructor(
    private bridgesStore: BridgesStoreService,
    private driveTimePolygonService: DriveTimePolygonService,
  ) {
    this.bridgesStore.driveTimeID$.subscribe(
      () => this.fetchDriveTimePolygon(),
      err => console.error(err)
    );
  }

  fetchDriveTimePolygon() {
    if (!this.bridgesStore.driveTimeID) { return; } // Don't fetch when not a number
    this.driveTimePolygonService.getDriveTimePolygon(this.bridgesStore.driveTimeID).subscribe(
      polygon => this.driveTimePolygon = polygon,
      err => console.error(err)
    );
  }
}
