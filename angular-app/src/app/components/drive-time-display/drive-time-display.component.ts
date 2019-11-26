import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-drive-time-display',
  templateUrl: './drive-time-display.component.html',
  styleUrls: ['./drive-time-display.component.css']
})
export class DriveTimeDisplayComponent implements OnInit, AfterViewInit {
  splitterOrientation = 'horizontal';
  mapSize = 100;
  tableSize = 0;

  constructor() { }

  ngOnInit() {
    this.getSplitterOrientation();
  }

  ngAfterViewInit() {
    this.mapSize = 80;
    this.tableSize = 20;
  }

  getSplitterOrientation() {
    if (window.innerWidth <= 599) {
      this.splitterOrientation = 'vertical';
    } else {
      this.splitterOrientation = 'horizontal';
    }
  }

  onResize(event: Event) {
    this.getSplitterOrientation();
  }

}
