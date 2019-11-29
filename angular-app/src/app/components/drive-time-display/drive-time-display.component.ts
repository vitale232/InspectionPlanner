import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DriveTimeMapComponent } from './drive-time-map/drive-time-map.component';

@Component({
  selector: 'app-drive-time-display',
  templateUrl: './drive-time-display.component.html',
  styleUrls: ['./drive-time-display.component.css']
})
export class DriveTimeDisplayComponent implements OnInit, AfterViewInit {
  splitterOrientation = 'horizontal';
  mapSize = 100;
  tableSize = 0;

  @ViewChild(DriveTimeMapComponent, { static: false })
  private driveTimeMapComponent: DriveTimeMapComponent;

  constructor() { }

  ngOnInit() {
    this.getSplitterOrientation();
  }

  ngAfterViewInit() {
    this.mapSize = 50;
    this.tableSize = 50;
    this.invalidateMapSize();
  }

  invalidateMapSize() {
    setTimeout(() => this.driveTimeMapComponent.map.invalidateSize(true), 100);
    setTimeout(() => console.log('fired'), 100);
  }

  getSplitterOrientation() {
    if (window.innerWidth <= 599) {
      this.splitterOrientation = 'vertical';
    } else {
      this.splitterOrientation = 'horizontal';
    }
  }

  splitDragEnd() {
    console.log('splitDragEnd');
    this.invalidateMapSize();
  }

  onResize(event: Event) {
    this.getSplitterOrientation();
  }

}
