import { Injectable } from '@angular/core';
import { NewYorkBridgesApiResponse, NewYorkBridgeFeature } from '../models/new-york-bridges.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BridgeQuery } from '../models/bridge-query.model';

@Injectable({
  providedIn: 'root'
})
export class NewYorkBridgeService {
  bridgeExtent = new Subject<NewYorkBridgeFeature>();

  constructor(
    private http: HttpClient
  ) { }

  sendBridgeFeature(feature: NewYorkBridgeFeature): void {
    this.bridgeExtent.next(feature);
  }

  getBridgeFeature$(): Observable<NewYorkBridgeFeature> {
    return this.bridgeExtent.asObservable();
  }

  getNewYorkBridgesBounds(uri: string, pageNumber: number, bounds): Observable<NewYorkBridgesApiResponse> {
    const queryParams: any = { };
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
      queryParams.page = pageNumber;
    }
    if (bounds) {
      const bbox = (
        `${bounds._northEast.lng},${bounds._southWest.lat},` +
        `${bounds._southWest.lng},${bounds._northEast.lat}`
      );
      queryParams.in_bbox = bbox;
    }
    return this.http.get<NewYorkBridgesApiResponse>(uri, { params: queryParams });
  }

  getNewYorkBridgesRandom(uri: string, pageNumber: number): Observable<NewYorkBridgesApiResponse> {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<NewYorkBridgesApiResponse>(uri, {
      params: {
        page: `${pageNumber}`
      }
    });
  }

  searchNewYorkBridgesBin(bin: string, pageNumber: number|null = null): Observable<NewYorkBridgesApiResponse> {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<NewYorkBridgesApiResponse>(this.newYorkBridgesUrl, {
      params: {
        page: `${pageNumber}`,
        bin
      }
    });
  }

  searchNewYorkBridgesQuery(query: BridgeQuery): Observable<NewYorkBridgesApiResponse> {
    function toTitleCase(str: string): string {
      if (str === '') {
        return '';
      } else {
        return str.split(' ')
          .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
          .join(' ');
      }
    }

    function defString(str: string): string {
      if (typeof str === undefined || typeof str === null) {
        return '';
      } else {
        return str;
      }
    }
    return this.http.get<NewYorkBridgesApiResponse>(this.newYorkBridgesUrl, {
      params: {
        bin: defString(query.bin),
        carried: defString(query.carried).toUpperCase(),
        county_name: defString(query.county).toUpperCase(),
        search: toTitleCase(defString(query.commonName)),
      }
    });
  }
}
