import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';


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
    private location: Location,
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
    // Since using the router to update query params is forcing data reloads on the map every time
    // the user pans, we're using the Location service to update the URL. The Location service
    // bypasses the angular Router, so you cannot subscribe to the router for queryParam changes. Instead
    // we use the Location service onUrlChange method, which accepts a callback and provides the url
    // as a string. Parse the string to get the necessary query params
    const queryParams = { lat: null, lon: null, z: null };
    this.location.onUrlChange((url, state) => {
      let urlParams = url;
      urlParams = urlParams.replace('/?', '');
      const urlParamsArray = urlParams.split('&');
      urlParamsArray.forEach((param) => {
        if (param.includes('lat=')) {
          queryParams.lat = parseFloat(param.split('=')[1]);
        }
        if (param.includes('lon=')) {
          queryParams.lon = parseFloat(param.split('=')[1]);
        }
        if (param.includes('z=')) {
          queryParams.z = parseInt(param.split('=')[1], 10);
        }
      });
      this.queryParams = queryParams;
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
