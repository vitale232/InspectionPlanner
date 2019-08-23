import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DriveTimeQueryApiResponse } from '../models/drive-time-queries.model';
import { Subject } from 'rxjs';
import { LocationSearchResult } from '../models/location-search.model';


@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueryService {
  driveTimeQueryUrl = 'routing/drive-time-queries/';
  nominatimUrl = 'https://nominatim.openstreetmap.org/search';
  photonUrl = 'https://photon.komoot.de/api';
  locationSearchSubject = new Subject<any>();

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

  sendLocationSearchResults(locationResult: LocationSearchResult) {
    this.locationSearchSubject.next(locationResult);
  }

  getLocationSearchResults() {
    return this.locationSearchSubject.asObservable();
  }

  locationSearch(query: string) {
    const queryParams = {
      q: query,
      format: 'json'
    };

    return this.http.get<any>(this.nominatimUrl, {
      params: queryParams
    });
  }
}
