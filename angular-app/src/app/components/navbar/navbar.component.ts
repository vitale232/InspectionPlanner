import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SidenavService } from 'src/app/services/sidenav.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  sidenavOpen = false;

  constructor(
    private sidenavService: SidenavService,
  ) { }

  toggleSidenav() {
    this.sidenavService.toggle();
    this.sidenavOpen = !this.sidenavOpen;
  }

}
