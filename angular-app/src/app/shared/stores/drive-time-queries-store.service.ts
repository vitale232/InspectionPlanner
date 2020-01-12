import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDriveTimeQueryFeature } from '../models/drive-time-queries.model';
import { DriveTimeQueriesService } from '../services/drive-time-queries.service';
import { BridgesStoreService } from './bridges-store.service';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueriesStoreService {
  // This class is dependent on the bridge store. It subscribes to the bridgeStore.DriveTimeID

  private readonly _driveTimeQueries = new BehaviorSubject<IDriveTimeQueryFeature[]>([]);
  readonly driveTimeQueries$ = this._driveTimeQueries.asObservable();

  get driveTimeQueries(): IDriveTimeQueryFeature[] {
    return this._driveTimeQueries.getValue();
  }

  set driveTimeQueries(val: IDriveTimeQueryFeature[]) {
    this._driveTimeQueries.next(val);
  }

  private readonly _selectedDriveTimeQuery = new BehaviorSubject<IDriveTimeQueryFeature>( null );
  readonly selectedDriveTimeQuery$ = this._selectedDriveTimeQuery.asObservable();

  get selectedDriveTimeQuery(): IDriveTimeQueryFeature {
    return this._selectedDriveTimeQuery.getValue();
  }

  set selectedDriveTimeQuery(val: IDriveTimeQueryFeature) {
    this._selectedDriveTimeQuery.next(val);
  }

  constructor(
      private driveTimeQueryService: DriveTimeQueriesService,
      private bridgesStore: BridgesStoreService,
      private notifications: NotificationsService,
    ) {
    this.fetchDriveTimeQueries();

    this.bridgesStore.driveTimeID$.subscribe(
      () => this.fetchDriveTimeQuery(),
      err => console.error(err)
    );
  }

  fetchDriveTimeQueries(): void {
    this.driveTimeQueryService.getDriveTimeQueries().subscribe(
      queries => this.driveTimeQueries = queries,
      err => console.error(err),
    );
  }

  fetchDriveTimeQuery() {
    if (!this.bridgesStore.driveTimeID) { return; } // Don't fetch when not a number
    this.driveTimeQueryService.getDriveTimeQuery(this.bridgesStore.driveTimeID).subscribe(
      query => this.selectedDriveTimeQuery = query,
      err => {
        console.error('DriveTimeQueriesStore', err);
        this.notifications.error(
          'Unhandled error',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
        );

      }
    );
  }

}
