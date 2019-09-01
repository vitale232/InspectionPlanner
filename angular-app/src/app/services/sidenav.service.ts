import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenav: MatSidenav;
  private sidenavOpen$ = new Subject<boolean>();

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  public open(): boolean {
    const openPromise = this.sidenav.open();
    openPromise.then((val) => {
      if (val === 'open') {
        this.sendSidenavState(true);
      }
    });
    return true;
  }

  public close(): boolean {
    const closePromise = this.sidenav.close();
    closePromise.then((val) => {
      if (val === 'close') {
        this.sendSidenavState(false);
      }
    });
    return false;
  }

  public toggle(): void {
    this.sidenav.toggle();
 }

 public getSidenavState(): Observable<boolean> {
   return this.sidenavOpen$.asObservable();
 }

 public sendSidenavState(openBool: boolean): void {
   this.sidenavOpen$.next(openBool);
 }
}
