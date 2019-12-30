import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './shared/services/sidenav.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscriptions = new Subscription();
  sidenavState$: Observable<boolean>;

  @Output() TABLE_CLOSED = new EventEmitter<boolean>();

  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;

  constructor(
    private ccService: NgcCookieConsentService,
    private sidenavService: SidenavService,
  ) {
    this.sidenavState$ = this.sidenavService.sidenavState$;
  }

  ngOnInit() {
    this.subscriptions.add(this.ccService.popupOpen$.subscribe());
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
