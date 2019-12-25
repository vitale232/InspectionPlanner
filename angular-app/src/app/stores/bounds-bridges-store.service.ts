import { Injectable } from '@angular/core';
import { TExtent } from '../models/open-layers-map.model';
import { NewYorkBridgeService } from '../services/new-york-bridge.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NewYorkBridgeFeature } from '../models/new-york-bridges.model';
import { LoadingIndicatorService } from '../services/loading-indicator.service';

@Injectable({
  providedIn: 'root'
})
export class BoundsBridgesStoreService {
  // Store the subscription to the bridgeService in the fetch call. This allows requests
  // to be cancelled when no longer required by unsubscribing
  bridgeSubscription: Subscription;

  // Create a private variable that contains a BehaviorSubject to store the most recently
  // queried bridges for a bounding box. Expose the BehaviorSubject as a readonly observable
  // for access in components
  private readonly _bridges = new BehaviorSubject<NewYorkBridgeFeature[]>([]);
  readonly bridges$ = this._bridges.asObservable();

  // The bridges property will contain the most recently emitted bridges from the BehaviorSubject
  get bridges(): NewYorkBridgeFeature[] {
    return this._bridges.getValue();
  }

  // To set the bridges property, emit a value in the behavior subject
  set bridges(val: NewYorkBridgeFeature[]) {
    this._bridges.next(val);
  }

  constructor(
    private bridgeService: NewYorkBridgeService,
    private loadingIndicatorService: LoadingIndicatorService,
  ) { }

  // Fetch the bridges property with the bridges that lie within a bounding box.
  fetchBridges(extent: TExtent) {
    this.loadingIndicatorService.sendLoadingIndicatorState(true);
    if (this.bridgeSubscription) { this.bridgeSubscription.unsubscribe(); }
    this.bridgeSubscription = this.bridgeService.getAllBridgesInBounds(extent).subscribe(
      (data) => {
        this.bridges = data;
      },
      (err) => {
        console.error('err from fetchBridges()', err);
        this.loadingIndicatorService.sendLoadingIndicatorState(false);
      },
      () => this.loadingIndicatorService.sendLoadingIndicatorState(false)
    );
  }

  fetchBridges$(extent: TExtent): Observable<NewYorkBridgeFeature[]> {
    return this.bridgeService.getAllBridgesInBounds(extent);
  }
}
