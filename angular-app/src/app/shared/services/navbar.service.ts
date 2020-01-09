import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private readonly _tableOpen = new BehaviorSubject<boolean>( false );
  readonly tableOpen$ = this._tableOpen.asObservable();

  get tableOpen(): boolean {
    return this._tableOpen.getValue();
  }

  set tableOpen(val: boolean) {
    this._tableOpen.next(val);
  }

  private readonly _settingsOpen = new BehaviorSubject<boolean>( false );
  readonly settingsOpen$ = this._settingsOpen.asObservable();

  get settingsOpen(): boolean {
    return this._settingsOpen.getValue();
  }

  set settingsOpen(val: boolean) {
    this._settingsOpen.next(val);
  }

  constructor() { }

}
