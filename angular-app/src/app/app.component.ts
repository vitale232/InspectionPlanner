import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SidenavService } from './services/sidenav.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidenav', { static: false }) public sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService
  ) { }

  ngAfterViewInit() {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
