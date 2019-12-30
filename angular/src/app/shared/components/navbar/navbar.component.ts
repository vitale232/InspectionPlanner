import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { Observable, Subscription } from 'rxjs';
import { NavbarService } from '../../services/navbar.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  tableOpen$: Observable<boolean>;

  @Input() sidenavState$: Observable<boolean>;
  @Output() sidenavAction = new EventEmitter< 'open' | 'close' >();

  subscriptions = new Subscription();
  longTitle = 'Inspection Planner Application';

  constructor(
    private router: Router,
    private navbarService: NavbarService,
  ) {
    this.tableOpen$ = this.navbarService.tableOpen$;
    if (!this.longTitle) { this.longTitle = 'Inspection Planner Application'; }
  }

  ngOnInit() {
    this.subscriptions.add(this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(
        (navEnd: NavigationEnd) => {
          const urlParts = navEnd.url.split(/[?,&,/]/).map(x => x.replace('/', ''));
          if (urlParts.includes('drive-time')) {
            this.longTitle = 'Drive Time Search';
          } else {
            this.longTitle = 'Inspection Planner Application';
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
