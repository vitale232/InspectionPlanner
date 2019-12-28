import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDriveTimeQueryFeature, IDriveTimeQueryApiResponse } from '../models/drive-time-queries.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueriesService {

  driveTimeQueryUri = 'routing/drive-time-queries/';

  constructor( private http: HttpClient ) { }

  getDriveTimeQueries(): Observable<IDriveTimeQueryFeature[]> {
    return this.http.get<IDriveTimeQueryApiResponse>(this.driveTimeQueryUri).pipe(
      map(data => data.results.features)
    );
  }
}
