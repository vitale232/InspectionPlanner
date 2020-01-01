import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDriveTimePolygonFeature } from '../models/drive-time-polygons.model';

@Injectable({
  providedIn: 'root'
})
export class DriveTimePolygonService {

  driveTimePolygonUrl = 'routing/drive-time-polygons/drive-time-queries/';

  constructor( private http: HttpClient ) { }

  getDriveTimePolygon(driveTimeID: number): Observable<IDriveTimePolygonFeature> {
    return this.http.get<IDriveTimePolygonFeature>(`${this.driveTimePolygonUrl}${driveTimeID}`);
  }
}
