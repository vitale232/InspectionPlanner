import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { Observable } from 'rxjs';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  tableOpen$: Observable<boolean>;

  @Input() sidenavState$: Observable<boolean>;
  @Output() sidenavAction = new EventEmitter< 'open' | 'close' >();

  constructor(
    private sidenavService: SidenavService,
    private navbarService: NavbarService,
  ) {
    this.tableOpen$ = this.navbarService.tableOpen$;
  }

  ngOnInit() {
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
