import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDriveTimeQueryApiResponse, IDriveTimeQueryFeature } from '../models/drive-time-queries.model';
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
  newDriveTimeUrl = 'routing/drive-time/';

  constructor(
    private http: HttpClient
  ) { }

  getDriveTimeQueries(pageNumber: number|null = null): Observable<IDriveTimeQueryApiResponse> {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<IDriveTimeQueryApiResponse>(this.driveTimeQueryUrl, {
      params: {
        page: `${pageNumber}`
      }
    });
  }

  getDriveTimeQuery(queryId: number) {
    return this.http.get<IDriveTimeQueryFeature>(this.driveTimeQueryUrl + `${queryId}/`);
  }

  getNewDriveTimeQuery(queryParams) {
    return this.http.get(this.newDriveTimeUrl, {
      params: queryParams
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
