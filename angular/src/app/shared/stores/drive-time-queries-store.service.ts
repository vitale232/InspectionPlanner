import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IDriveTimeQueryFeature } from '../models/drive-time-queries.model';
import { DriveTimeQueriesService } from '../services/drive-time-queries.service';

@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueriesStoreService {

  private readonly _driveTimeQueries = new BehaviorSubject<IDriveTimeQueryFeature[]>([]);
  readonly driveTimeQueries$ = this._driveTimeQueries.asObservable();

  get driveTimeQueries(): IDriveTimeQueryFeature[] {
    return this._driveTimeQueries.getValue();
  }

  set driveTimeQueries(val: IDriveTimeQueryFeature[]) {
    this._driveTimeQueries.next(val);
  }

  constructor( private driveTimeQueryService: DriveTimeQueriesService ) {
    this.fetchDriveTimeQueries();
  }

  fetchDriveTimeQueries(): void {
    this.driveTimeQueryService.getDriveTimeQueries().subscribe(
      queries => this.driveTimeQueries = queries,
      err => console.error(err),
      () => console.log('loaded dtqs in store')
    );
  }

}
