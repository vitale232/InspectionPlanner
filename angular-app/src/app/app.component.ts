import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './shared/services/sidenav.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription, Observable } from 'rxjs';
import { BrowserHistoryService } from './shared/services/browser-history.service';
import { ColormapStoreService } from './shared/stores/colormap-store.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingIndicatorService } from './shared/services/loading-indicator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  routeLoading = false;
  mapLoading = false;

  private subscriptions = new Subscription();
  sidenavState$: Observable<boolean>;

  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;

  constructor(
    private ccService: NgcCookieConsentService,
    private sidenavService: SidenavService,
    private browserHistory: BrowserHistoryService,
    private colormapStore: ColormapStoreService,
    private loadingIndicator: LoadingIndicatorService,
    private router: Router,
  ) {
    this.sidenavState$ = this.sidenavService.sidenavState$;
    if (localStorage.getItem('colormap')) {
      this.colormapStore.colormap = JSON.parse(localStorage.getItem('colormap'));
    }
    // Call the BrowserHistoryService so that it starts creating a route history
    let browserHistoryInit = this.browserHistory.currentUrl;
    browserHistoryInit = 'thanks!';
  }

  ngOnInit() {
    this.subscriptions.add(this.ccService.popupOpen$.subscribe());
    this.subscriptions.add(this.loadingIndicator.loading$.subscribe(
      (loading: boolean) => this.mapLoading = loading,
    ));
    this.subscriptions.add(this.router.events.pipe(
      filter((e) => e instanceof NavigationStart || e instanceof NavigationEnd)
    ).subscribe(
      (event) => {
        if (event instanceof NavigationStart && this.mapLoading === false) { this.routeLoading = true; }
        if (event instanceof NavigationEnd) { setTimeout(() => this.routeLoading = false, 1000); }
      })
    );
  }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onSidenavAction(actionEvent: 'open' | 'close') {
    if (actionEvent === 'open') {
      this.sidenavService.open();
    } else if (actionEvent === 'close') {
      this.sidenavService.close();
    }
  }

  escape(event) {
    this.sidenavService.close();
  }

  fKey(event) {
    this.sidenavService.open();
  }

}
