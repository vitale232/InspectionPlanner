import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SearchMarker } from '../models/markers.model';

@Injectable({
  providedIn: 'root'
})
export class SearchMarkersStoreService {

  private readonly _searchMarkers = new BehaviorSubject<SearchMarker[]>( [ ] );
  readonly searchMarker$ = this._searchMarkers.asObservable();

  set searchMarkers(markers: SearchMarker[]) {
    this._searchMarkers.next(markers);
  }

  get searchMarkers() {
    return this._searchMarkers.getValue();
  }

  constructor() { }

}
