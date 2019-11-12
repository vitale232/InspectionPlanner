import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  sidenavSubscription: Subscription|null;
  sidenavState$: Observable<boolean>|null;
  routerSubscription: Subscription|null;
  driveTimeVisible = false;
  queryParamsSubscription: Subscription|null;
  queryParams: Params;

  constructor(
    public sidenavService: SidenavService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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

  ngOnInit() {
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(
      params => {
        this.queryParams = params;
        console.log(this.queryParams);
      },
      err => console.error(err),
      () => console.log('complete')
    );
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
