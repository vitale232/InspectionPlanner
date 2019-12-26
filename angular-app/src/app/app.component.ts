import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './services/sidenav.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription, Observable } from 'rxjs';
import { LoadingIndicatorService } from './services/loading-indicator.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  popupOpenSubscription: Subscription;
  loadingIndicator$: Observable<boolean>;
  sidenavOpen: boolean;
  allowSidenavEscape = true;
  routerSubscription: Subscription;
  openLayersVisible = false;

  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private ccService: NgcCookieConsentService,
    private loadingIndicatorService: LoadingIndicatorService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe();
    this.loadingIndicator$ = this.loadingIndicatorService.getLoadingIndicatorState$();
    this.sidenavService.getSidenavState$().subscribe((data: boolean) => {
      this.sidenavOpen = data;
    });
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((val: NavigationEnd) => {
        const urlParts = val.url.split(/[?,&,/]/).map(x => x.replace('/', ''));
        if (urlParts.includes('openlayers')) {
          this.openLayersVisible = true;
        } else {
          this.openLayersVisible = false;
        }
      });
  }
  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  escape($event) {
    if (this.allowSidenavEscape) {
      this.sidenavService.close();
    }
  }

  fKey($event) {
    this.sidenavService.open();
  }

  onFocus($event) {
    this.allowSidenavEscape = $event;
  }

  onBlur($event) {
    this.allowSidenavEscape = $event;
  }

  ngOnDestroy() {
    if (this.popupOpenSubscription) {
      this.popupOpenSubscription.unsubscribe();
    }
  }
}
