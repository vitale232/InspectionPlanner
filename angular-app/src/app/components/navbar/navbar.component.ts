import { Component, OnDestroy } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnDestroy {
  sidenavSubscription: Subscription|null;
  sidenavState$: Observable<boolean>|null;

  constructor(
    private sidenavService: SidenavService,
  ) {
    this.sidenavState$ = this.sidenavService.getSidenavState();
  }

  ngOnDestroy() {
    this.sidenavSubscription.unsubscribe();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  closeSidenav() {
    this.sidenavService.close();
  }
}
