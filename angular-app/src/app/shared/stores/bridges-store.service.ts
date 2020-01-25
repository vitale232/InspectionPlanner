import { Injectable } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { IBridgeFeature, IBridgeFeatureCollection } from '../models/bridges.model';
import { BridgesService } from '../services/bridges.service';
import { LoadingIndicatorService } from '../services/loading-indicator.service';
import { TExtent } from '../models/open-layers-map.model';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class BridgesStoreService {

  // Store the subscription to the bridgeService in the fetch call. This allows requests
  // to be cancelled when no longer required by unsubscribing
  bridgeSubscription: Subscription;

  private readonly _bridges = new BehaviorSubject<IBridgeFeature[]>( [ ] );
  readonly bridges$ = this._bridges.asObservable();

  get bridges(): IBridgeFeature[] {
    return this._bridges.getValue();
  }

  set bridges(val: IBridgeFeature[]) {
    this._bridges.next(val);
  }

  private readonly _driveTimeBridges = new BehaviorSubject<IBridgeFeature[]>( [ ] );
  readonly driveTimeBridges$ = this._driveTimeBridges.asObservable();

  get driveTimeBridges(): IBridgeFeature[] {
    return this._driveTimeBridges.getValue();
  }

  set driveTimeBridges(val: IBridgeFeature[]) {
    this._driveTimeBridges.next(val);
  }

  private readonly _driveTimeID = new BehaviorSubject<number>( null );
  readonly driveTimeID$ = this._driveTimeID.asObservable();

  get driveTimeID(): number {
    return this._driveTimeID.getValue();
  }

  set driveTimeID(val: number) {
    this._driveTimeID.next(val);
  }

  private readonly _allBridges = new BehaviorSubject<IBridgeFeatureCollection>( null );
  readonly allBridges$ = this._allBridges.asObservable();

  get allBridges(): IBridgeFeatureCollection {
    return this._allBridges.getValue();
  }

  set allBridges(val: IBridgeFeatureCollection) {
    this._allBridges.next(val);
  }

  constructor(
    private bridgesService: BridgesService,
    private loadingIndicatorService: LoadingIndicatorService,
    private notifications: NotificationsService,
  ) { }

  fetchBridges(bbox: TExtent): void {
    this.loadingIndicatorService.loading = true;
    if (this.bridgeSubscription) { this.bridgeSubscription.unsubscribe(); }
    this.bridgeSubscription = this.bridgesService.getAllBridgesInBbox(bbox).subscribe(
      bridges => {console.log(bridges); this.bridges = bridges;},
      err => {
        console.error('error in fetchBridges()', err);
        this.notifications.error(
          'Unhandled error',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
        );
        this.loadingIndicatorService.loading = false;
      },
      () => this.loadingIndicatorService.loading = false
    );
  }

  fetchDriveTimeBridges(driveTimeID: number): void {
    this.loadingIndicatorService.loading = true;
    this.bridgesService.getDriveTimeBridges(driveTimeID).subscribe(
      bridges => this.driveTimeBridges = bridges,
      err => {
        console.error('error in fetchBridges()', err);
        this.loadingIndicatorService.loading = false;
        this.notifications.error(
          'Unhandled error',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
        );
      },
      () => {
        this.loadingIndicatorService.loading = false;
        this.driveTimeID = driveTimeID;
      }
    );
  }

  fetchAllBridges(): void {
    this.loadingIndicatorService.loading = true;
    this.bridgesService.getAllBridges().subscribe(
      bridges => this.allBridges = bridges,
      err => {
        console.error('error in fetchAllBridges()', err);
        this.loadingIndicatorService.loading = false;
        this.notifications.error(
          'Unhandled Error',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
        );
      },
      () => this.loadingIndicatorService.loading = false
    );
  }
}
