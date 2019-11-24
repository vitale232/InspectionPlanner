import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { concatMap, map, filter, take, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollDriveTimeQueryService {
  driveTimeUrl = '/routing/drive-time/';

  constructor(
    private http: HttpClient,
  ) { }

  newDriveTimeQuery(searchText: string, driveTimeHours: number) {
    const queryParams = { q: searchText, return_bridge: 'false', drive_time_hours: driveTimeHours.toString() };
    return this.http.get(this.driveTimeUrl, { params: queryParams, observe: 'response' });
  }

  pollDriveTimeQuery(searchText: string, driveTimeHours: number) {
    return timer(0, 20000)
      .pipe(
        mergeMap((i) => {
          console.log('from concat map, i=', i);
          return this.newDriveTimeQuery(searchText, driveTimeHours);
        }),
        filter((response: HttpResponse<any>) => response.status === 200),
        take(1),
      );
  }
}
