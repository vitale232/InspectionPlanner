import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { IDriveTimeQueryFeature, IDriveTimeQueryApiResponse, INewDriveTimeParms } from '../models/drive-time-queries.model';
import { filter, map, mergeMap, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueriesService {

  driveTimeUri = 'routing/drive-time/';
  driveTimeQueryUri = 'routing/drive-time-queries/';

  constructor( private http: HttpClient ) { }

  getDriveTimeQueries(): Observable<IDriveTimeQueryFeature[]> {
    return this.http.get<IDriveTimeQueryApiResponse>(this.driveTimeQueryUri).pipe(
      map(data => data.results.features)
    );
  }

  getDriveTime(queryParams: INewDriveTimeParms) {
    const params = new HttpParams()
      .set('q', queryParams.q)
      .set('drive_time_hours', queryParams.drive_time_hours)
      .set('return_bridges', queryParams.return_bridges.toString());
    return this.http.get(this.driveTimeUri, { params });
  }

  pollDriveTimeQuery(queryParams: INewDriveTimeParms) {
    return timer(0, 25000).pipe(
      mergeMap(() => this.getDriveTime(queryParams) ),
      filter((response: HttpResponse<any>) => response.status === 200 ),
      take(1)
    );
  }

  getDriveTimeQuery(driveTimeID: number) {
    return this.http.get<IDriveTimeQueryFeature>(`${this.driveTimeQueryUri}${driveTimeID}/`);
  }
}
