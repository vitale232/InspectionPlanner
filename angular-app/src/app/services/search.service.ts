import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DriveTimeQueryApiResponse } from '../models/drive-time-queries.model';
import { Subject, Observable } from 'rxjs';
import { LocationSearchResult, FilterSearch, NominatimApiResponse } from '../models/location-search.model';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  driveTimeQueryUrl = 'routing/drive-time-queries/';
  nominatimUrl = 'https://nominatim.openstreetmap.org/search';
  photonUrl = 'https://photon.komoot.de/api';
  locationSearchSubject = new Subject<LocationSearchResult>();

  constructor(
    private http: HttpClient
  ) { }

  getDriveTimeQueries(pageNumber: number|null = null): Observable<DriveTimeQueryApiResponse> {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<DriveTimeQueryApiResponse>(this.driveTimeQueryUrl, {
      params: {
        page: `${pageNumber}`
      }
    });
  }

  sendLocationSearchResult(locationResult: LocationSearchResult) {
    this.locationSearchSubject.next(locationResult);
  }

  getLocationSearchResult$(): Observable<LocationSearchResult> {
    return this.locationSearchSubject.asObservable();
  }

  locationSearch(query: string): Observable<NominatimApiResponse[]> {
    const queryParams = {
      q: query,
      format: 'json'
    };

    return this.http.get<NominatimApiResponse[]>(this.nominatimUrl, {
      params: queryParams
    });
  }

  filterSearch(query: FilterSearch): Observable<NominatimApiResponse[]> {
    const queryParams = {
      street: query.streetAddress,
      city: query.city,
      state: query.state,
      country: query.country,
      format: 'json'
    };

    return this.http.get<NominatimApiResponse[]>(this.nominatimUrl, {
      params: queryParams
    });
  }
}
