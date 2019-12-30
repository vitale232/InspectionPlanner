import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav;

  private readonly _sidenavOpen = new BehaviorSubject<boolean>(false);
  public readonly sidenavState$ = this._sidenavOpen.asObservable();

  get sidenavOpen(): boolean {
    return this._sidenavOpen.getValue();
  }

  set sidenavOpen(val: boolean) {
    this._sidenavOpen.next(val);
  }

  constructor() { }

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  public open(): boolean {
    this.sidenav.open().then((val) => {
      if (val === 'open') {
        this.sidenavOpen = true;
      }
    });
    return true;
  }

  public close(): boolean {
    this.sidenav.close().then((val) =>  {
      if (val === 'close') {
        this.sidenavOpen = false;
      }
    });
    return true;
  }

  public toggle() {
    this.sidenav.toggle().then((val) => {
      if (val === 'open') {
        this.sidenavOpen = true;
      } else if (val === 'close') {
        this.sidenavOpen = false;
      }
    });
  }

}
