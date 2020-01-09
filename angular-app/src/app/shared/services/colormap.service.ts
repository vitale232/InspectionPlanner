import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IColormapQueryParams, IColormap } from '../models/map-settings.model';

@Injectable({
  providedIn: 'root'
})
export class ColormapService {
  colormapUrl = 'bridges/new-york-bridges/colormap/';

  constructor( private http: HttpClient ) { }

  getColormap(queryParams: IColormapQueryParams) {
    const params = new HttpParams()
      .set('bins', queryParams.bins.toString())
      .set('colormap', queryParams.colormap)
      .set('field', queryParams.field)
      .set('mode', queryParams.mode);
    return this.http.get<IColormap>(this.colormapUrl, { params });
  }
}
