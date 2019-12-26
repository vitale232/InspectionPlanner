import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  private sidenav: MatSidenav;

  private sidenavOpen = new Subject<boolean>();
  public sidenavState$ = this.sidenavOpen.asObservable();


  constructor() { }

  // public getSidenavState$(): Observable<boolean> {
  //   return this.sidenavOpen.asObservable();
  // }

  public sendSidenavState(openBool: boolean): void {
    this.sidenavOpen.next(openBool);
  }

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  public open(): boolean {
    this.sidenav.open().then((val) => {
      if (val === 'open') {
        this.sendSidenavState(true);
      }
    });
    return true;
  }

  public close(): boolean {
    this.sidenav.close().then((val) =>  {
      if (val === 'close') {
        this.sendSidenavState(false);
      }
    });
    return true;
  }

  public toggle() {
    this.sidenav.toggle().then((val) => {
      if (val === 'open') {
        this.sendSidenavState(true);
      } else if (val === 'close') {
        this.sendSidenavState(false);
      }
    });
  }

}
