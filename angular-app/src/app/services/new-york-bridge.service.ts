import { Injectable } from '@angular/core';
import { NewYorkBridgesApiResponse, NewYorkBridgeFeature } from '../models/new-york-bridges.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MapExtent } from '../models/map-tools.model';

@Injectable({
  providedIn: 'root'
})
export class NewYorkBridgeService {
  newYorkBridgesUrl = 'bridges/new-york-bridges/';
  newYorkBridgesHeavyUrl = 'bridges/new-york-bridges/feeling-lucky/';
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

  getNewYorkBridgesBounds(pageNumber: number, bounds): Observable<NewYorkBridgesApiResponse> {
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
    return this.http.get<NewYorkBridgesApiResponse>(this.newYorkBridgesUrl, { params: queryParams });
  }

  getNewYorkBridgesRandom(pageNumber: number): Observable<NewYorkBridgesApiResponse> {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<NewYorkBridgesApiResponse>(this.newYorkBridgesHeavyUrl, {
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
        search: bin
      }
    });
  }
}
