import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { INominatimApiResponse, IFilterSearch } from '../models/nominatim-api.model';

@Injectable({
  providedIn: 'root'
})
export class NominatimSearchService {

  nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor( private http: HttpClient ) { }

  query(q: string): Observable<INominatimApiResponse[]> {
    const params = {
      q,
      format: 'json'
    };
    return this.http.get<INominatimApiResponse[]>(this.nominatimUrl, { params } );
  }

  paramQuery(query: IFilterSearch): Observable<INominatimApiResponse[]> {
    const params = {
      street: query.streetAddress,
      city: query.city,
      state: query.state,
      country: query.country,
      format: 'json'
    };
    return this.http.get<INominatimApiResponse[]>(this.nominatimUrl, { params } );
  }

}
