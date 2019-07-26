import { Injectable } from '@angular/core';
import { NewYorkBridgesApiResponse } from '../models/new-york-bridges.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewYorkBridgeService {
  newYorkBridgesUrl = 'bridges/new-york-bridges/';
  newYorkBridgesHeavyUrl = 'bridges/new-york-bridges-feeling-lucky/';
  constructor(
    private http: HttpClient
  ) { }

  getNewYorkBridges(pageNumber: number) {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<NewYorkBridgesApiResponse>(this.newYorkBridgesUrl, {
      params: {
        page: `${pageNumber}`
      }
    });
  }

  getNewYorkBridgesHeavyTraffic(pageNumber: number) {
    if (pageNumber === undefined || pageNumber === null) {
      pageNumber = 1;
    }
    return this.http.get<NewYorkBridgesApiResponse>(this.newYorkBridgesHeavyUrl, {
      params: {
        page: `${pageNumber}`
      }
    });
  }
}
