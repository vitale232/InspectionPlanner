import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IColormap } from '../models/map-settings.model';

@Injectable({
  providedIn: 'root'
})
export class ColormapStoreService {

  private readonly _colormap = new BehaviorSubject<IColormap>( null );
  readonly colormap$ = this._colormap.asObservable();

  get colormap(): IColormap {
    return this._colormap.getValue();
  }

  set colormap(val: IColormap) {
    this._colormap.next(val);
  }

  constructor() { }

}
