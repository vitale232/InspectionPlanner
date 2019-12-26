import { Component, OnInit, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse-bridges-display',
  templateUrl: './browse-bridges-display.component.html',
  styleUrls: ['./browse-bridges-display.component.scss']
})
export class BrowseBridgesDisplayComponent implements OnInit, AfterViewInit, OnDestroy {

  navbarSubscription: Subscription;
  splitterOrientation: 'horizontal' | 'vertical' = 'horizontal';
  mapSize = 50;
  tableSize = 50;

  constructor(
    private navbarService: NavbarService,
  ) {
    this.navbarSubscription = this.navbarService.tableOpen$.subscribe(
      (tableOpen: boolean) => {
        if (tableOpen) { this.openTable(); } else { this.closeTable(); }
      }
    );
  }

  ngOnInit() {

    this.getSplitterOrientation();
    this.tableSize = 50;
    this.mapSize = 50;
    this.navbarService.tableOpen = true;
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.navbarSubscription.unsubscribe();
  }

  closeTable() {
    this.mapSize = 100;
    this.tableSize = 0;
  }

  openTable() {
    this.mapSize = 50;
    this.tableSize = 50;
  }

  getSplitterOrientation() {
    if (window.innerWidth <= 599) {
      this.splitterOrientation = 'vertical';
    } else {
      this.splitterOrientation = 'horizontal';
    }
  }

  splitDragEnd(event: { gutterNum: number, sizes: number[] }) {
    console.log('dragEnd');
    this.mapSize = event.sizes[0];
    this.tableSize = event.sizes[1];
    if (this.tableSize <= 1) {
      this.navbarService.tableOpen = false;
    } else {
      this.navbarService.tableOpen = true;
    }
  }

  onResize(event: Event) {
    this.getSplitterOrientation();
  }

}
