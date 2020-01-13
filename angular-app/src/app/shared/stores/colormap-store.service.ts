import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IColormap, IDistinctColormap } from '../models/map-settings.model';
import { defaultColormap } from '../components/open-layers-map/default-colormap';

@Injectable({
  providedIn: 'root'
})
export class ColormapStoreService {

  private readonly _colormap = new BehaviorSubject<IColormap|IDistinctColormap>( defaultColormap );
  readonly colormap$ = this._colormap.asObservable();

  get colormap(): IColormap|IDistinctColormap {
    return this._colormap.getValue();
  }

  set colormap(val: IColormap|IDistinctColormap) {
    localStorage.setItem('colormap', JSON.stringify(val));
    this._colormap.next(val);
  }

  constructor() { }

}
