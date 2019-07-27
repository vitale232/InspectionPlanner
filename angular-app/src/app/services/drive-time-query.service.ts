import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DriveTimeQueryApiResponse } from '../models/drive-time-queries.model';

@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueryService {
  driveTimeQueryUrl = 'routing/drive-time-queries/';

  constructor(
    private http: HttpClient
  ) { }

  getDriveTimeQueries(pageNumber: number|null = null) {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<DriveTimeQueryApiResponse>(this.driveTimeQueryUrl, {
      params: {
        page: `${pageNumber}`
      }
    });
  }
}
