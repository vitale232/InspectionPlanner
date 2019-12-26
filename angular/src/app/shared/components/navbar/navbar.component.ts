import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() sidenavState$: Observable<boolean>;
  @Output() sidenavAction = new EventEmitter< 'open' | 'close' >();

  constructor(
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
  }

  openSidenav(): void {
    this.sidenavAction.emit('open');
  }

  closeSidenav(): void {
    this.sidenavAction.emit('close');
  }

}
