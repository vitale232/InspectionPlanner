import { Injectable } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { IBridgeFeature } from '../models/bridges.model';
import { BridgesService } from '../services/bridges.service';
import { LoadingIndicatorService } from '../services/loading-indicator.service';
import { TExtent } from '../models/open-layers-map.model';

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

  constructor(
    private bridgesService: BridgesService,
    private loadingIndicatorService: LoadingIndicatorService,
  ) { }

  fetchBridges(bbox: TExtent) {
    this.loadingIndicatorService.loading = true;
    if (this.bridgeSubscription) { this.bridgeSubscription.unsubscribe(); }
    this.bridgeSubscription = this.bridgesService.getAllBridgesInBbox(bbox).subscribe(
      bridges => this.bridges = bridges,
      err => {
        console.error('error in fetchBridges()', err);
        this.loadingIndicatorService.loading = false;
      },
      () => this.loadingIndicatorService.loading = false
    );
  }
}
