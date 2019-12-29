import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TExtent } from '../models/open-layers-map.model';
import { IBridgesApiResponse, IBridgeFeature } from '../models/bridges.model';

import { map, expand, reduce, take } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BridgesService {

  bridgesUri = 'bridges/new-york-bridges/';

  constructor( private http: HttpClient ) { }

  getBbox(extent: TExtent): Observable<IBridgesApiResponse> {
    return this.http.get<IBridgesApiResponse>(this.bridgesUri);
  }
  getAllBridgesInBbox(extent: TExtent): Observable<IBridgeFeature[]> {
    return this.http.get<IBridgesApiResponse>(this.bridgesUri, { params: { in_bbox: extent.join(',') } }).pipe(
      expand(data => data.next ? this.http.get<IBridgesApiResponse>(data.next.replace(/https?:\/\/[^\/]+/i, '')) : EMPTY),
      map(d => d.results.features),
      reduce((x, acc) => acc.concat(x)),
      take(1)
    );
  }
}
