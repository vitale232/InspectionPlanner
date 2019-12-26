import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private readonly _tableOpen = new BehaviorSubject<boolean>(false);
  readonly tableOpen$ = this._tableOpen.asObservable();

  get tableOpen() {
    return this._tableOpen.getValue();
  }

  set tableOpen(val: boolean) {
    this._tableOpen.next(val);
  }
  constructor() { }
}
