import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {

  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  get loading(): boolean {
    return this._loading.getValue();
  }

  set loading(val: boolean) {
    this._loading.next(val);
  }

  constructor() { }

}
