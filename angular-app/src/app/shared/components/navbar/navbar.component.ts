import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { Observable, Subscription } from 'rxjs';
import { NavbarService } from '../../services/navbar.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NotificationStoreService } from '../../stores/notification-store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  tableOpen$: Observable<boolean>;
  settingsOpen$: Observable<boolean>;
  notificationCount$: Observable<number>;

  @Input() sidenavState$: Observable<boolean>;
  @Output() sidenavAction = new EventEmitter<'open'|'close'>();

  subscriptions = new Subscription();
  longTitle = 'Inspection Planner Application';
  markerClusterShowing = false;
  markerGalleryShowing = false;

  constructor(
    private router: Router,
    private navbarService: NavbarService,
    private notificationStore: NotificationStoreService,
  ) {
    this.tableOpen$ = this.navbarService.tableOpen$;
    this.settingsOpen$ = this.navbarService.settingsOpen$;
    this.notificationCount$ = this.notificationStore.notificationCount$;
    if (!this.longTitle) { this.longTitle = 'Inspection Planner Application'; }
  }

  increment() {
    this.notificationStore.incrementNotificationCount();
  }

  reset() {
    this.notificationStore.clearNotificationCount();
  }

  ngOnInit() {
    this.subscriptions.add(this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(
        (navEnd: NavigationEnd) => {
          const urlParts = navEnd.url.split(/[?,&,/]/).map(x => x.replace('/', ''));
          if (urlParts.includes('drive-time')) {
            const driveTimeID = urlParts.find((x: string) => new RegExp(/^\d{2,3}$/).test(x));
            this.longTitle = `Drive Time Search ${driveTimeID}`;
          } else {
            this.longTitle = 'Inspection Planner Application';
          }
          if (urlParts.includes('map-settings')) {
            this.navbarService.settingsOpen = true;
          } else {
            this.navbarService.settingsOpen = false;
          }
          if (urlParts.includes('marker-cluster')) {
            this.markerClusterShowing = true;
          } else {
            this.markerClusterShowing = false;
          }
          if (urlParts.includes('map-settings') && urlParts.includes('gallery')) {
            this.markerGalleryShowing = true;
          } else {
            this.markerGalleryShowing = false;
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openSidenav(): void {
    this.sidenavAction.emit('open');
  }

  closeSidenav(): void {
    this.sidenavAction.emit('close');
  }

  openTable() {
    this.navbarService.tableOpen = true;
  }

  closeTable() {
    this.navbarService.tableOpen = false;
  }

}
