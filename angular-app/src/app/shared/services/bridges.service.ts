import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TExtent } from '../models/open-layers-map.model';
import { IBridgesApiResponse, IBridgeFeature, IBridgeFeatureCollection } from '../models/bridges.model';

import { map, expand, reduce, take, retry, retryWhen, delay, mergeMap } from 'rxjs/operators';
import { EMPTY, Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BridgesService {

  bridgesUri = 'bridges/new-york-bridges/';
  driveTimeBridgesUri = 'bridges/new-york-bridges/drive-time-query/';
  allBridgesUri = 'assets/all_bridges_mini.json';

  constructor( private http: HttpClient ) { }

  getBbox(extent: TExtent): Observable<IBridgesApiResponse> {
    return this.http.get<IBridgesApiResponse>(this.bridgesUri);
  }

  getAllBridgesInBbox(extent: TExtent): Observable<IBridgeFeature[]> {
    let retries = 3;
    return this.http.get<IBridgesApiResponse>(this.bridgesUri, { params: { in_bbox: extent.join(',') } }).pipe(
      expand(data => data.next ? this.http.get<IBridgesApiResponse>(data.next.replace(/https?:\/\/[^\/]+/i, '')) : EMPTY),
      map(d => d.results.features),
      reduce((x, acc) => acc.concat(x)),
      take(1),
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }

  getDriveTimeBridges(driveTimeID: number): Observable<IBridgeFeature[]> {
    let retries = 3;
    return this.http.get<IBridgesApiResponse>(`${this.driveTimeBridgesUri}${driveTimeID}/`).pipe(
      expand(data => data.next ? this.http.get<IBridgesApiResponse>(data.next.replace(/https?:\/\/[^\/]+/i, '')) : EMPTY),
      map(d => d.results.features),
      reduce((x, acc) => acc.concat(x)),
      take(1),
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }

  getAllBridges(): Observable<IBridgeFeatureCollection> {
    return this.http.get<IBridgeFeatureCollection>(this.allBridgesUri);
  }
}
