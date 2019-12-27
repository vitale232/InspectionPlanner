import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TExtent } from '../models/open-layers-map.model';
import { BridgesApiResponse, BridgeFeature } from '../models/bridges.model';

import { map, expand, reduce, take } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BridgesService {

  bridgesUri = 'bridges/new-york-bridges/';

  constructor( private http: HttpClient ) { }

  getBbox(extent: TExtent): Observable<BridgesApiResponse> {
    return this.http.get<BridgesApiResponse>(this.bridgesUri);
  }
  getAllBridgesInBbox(extent: TExtent): Observable<BridgeFeature[]> {
    return this.http.get<BridgesApiResponse>(this.bridgesUri, { params: { in_bbox: extent.join(',') } }).pipe(
      expand(data => data.next ? this.http.get<BridgesApiResponse>(data.next.replace(/https?:\/\/[^\/]+/i, '')) : EMPTY),
      map(d => d.results.features),
      reduce((x, acc) => acc.concat(x)),
      take(1)
    );
  }
}
