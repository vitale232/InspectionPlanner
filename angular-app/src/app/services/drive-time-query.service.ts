import { Injectable } from '@angular/core';
import { timer, Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { filter, take, mergeMap } from 'rxjs/operators';
import { IDriveTimeQueryApiResponse, IDriveTimeQueryFeature, IQueryProperties } from '../models/drive-time-queries.model';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DriveTimeQueryService {
  driveTimeUrl = '/routing/drive-time/';
  driveTimeQueryUrl = 'routing/drive-time-queries/';
  recentQueries: IQueryProperties[];
  recentQueriesSubject = new Subject<IQueryProperties[]>();
  originalDriveTimeQueryCount: number;
  queryNotificationSubject = new Subject<number>();

  constructor(
    private http: HttpClient,
  ) { }

  pollDriveTimeQuery(searchText: string, driveTimeHours: number) {
    return timer(0, 20000).pipe(
      mergeMap(() => this.newDriveTimeQuery(searchText, driveTimeHours)),
      filter((response: HttpResponse<any>) => response.status === 200),
      take(1),
      );
  }

  getNewDriveTimeQuery(params: Params) {
    return this.http.get(this.driveTimeUrl, { params } );
  }

  unshiftRecentQueries(query: IQueryProperties) {
    this.recentQueries.unshift(query);
    this.addNotifications(this.recentQueries.length - this.originalDriveTimeQueryCount);
  }

  addNotifications(value: number) {
    this.queryNotificationSubject.next(value);
  }

  getNotification$(): Observable<number> {
    return this.queryNotificationSubject.asObservable();
  }

  sendRecentQueriesArray(sendArray: IQueryProperties[]) {
    this.recentQueriesSubject.next(sendArray);
  }

  receiveRecentQueriesArray$(): Observable<IQueryProperties[]> {
    return this.recentQueriesSubject.asObservable();
  }

  getRecentQueries(page: number) {
    this.getDriveTimeQueries(page)
      .subscribe(
        (data: IDriveTimeQueryApiResponse) => {
          this.originalDriveTimeQueryCount = data.count;
          const features = data.results.features;
          const queryProperties = [];
          features.forEach(element => {
            queryProperties.push({
              drive_time_hours: element.properties.drive_time_hours,
              display_name: element.properties.display_name,
              id: element.id,
              lat: element.properties.lat,
              lon: element.properties.lon,
              polygon_pending: element.properties.polygon_pending,
              search_text: element.properties.search_text,
              });
            });
          this.recentQueries = queryProperties;
        },
        (err) => console.error(err),
        () => this.sendRecentQueriesArray(this.recentQueries)
      );
  }

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

  newDriveTimeQuery(searchText: string, driveTimeHours: number) {
    const queryParams = { q: searchText, return_bridge: 'false', drive_time_hours: driveTimeHours.toString() };
    return this.http.get(this.driveTimeUrl, { params: queryParams, observe: 'response' });
  }
}
