import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './services/sidenav.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription, Observable } from 'rxjs';
import { LoadingIndicatorService } from './services/loading-indicator.service';


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

  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private ccService: NgcCookieConsentService,
    private loadingIndicatorService: LoadingIndicatorService
  ) { }

  ngOnInit() {
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe();
    this.loadingIndicator$ = this.loadingIndicatorService.getLoadingIndicatorState$();
    this.sidenavService.getSidenavState$().subscribe((data: boolean) => {
      this.sidenavOpen = data;
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
