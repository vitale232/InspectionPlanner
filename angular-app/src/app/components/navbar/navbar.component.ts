import { Component, OnDestroy } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  sidenavSubscription: Subscription|null;
  sidenavState$: Observable<boolean>|null;
  routerSubscription: Subscription|null;
  driveTimeVisible = false;

  constructor(
    public sidenavService: SidenavService,
    private router: Router,
  ) {
    this.sidenavState$ = this.sidenavService.getSidenavState$();
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((val: NavigationEnd) => {
        const urlParts = val.url.split('/');
        if (urlParts.includes('drive-time')) {
          this.driveTimeVisible = true;
        } else {
          this.driveTimeVisible = false;
        }
      });
  }

  ngOnDestroy() {
    this.sidenavSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  closeSidenav() {
    this.sidenavService.close();
  }
}
