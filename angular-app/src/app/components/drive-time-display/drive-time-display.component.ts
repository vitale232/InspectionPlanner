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
  visible = true;

  @ViewChild(DriveTimeMapComponent, { static: false }) private driveTimeMapComponent: DriveTimeMapComponent;

  constructor() { }

  ngOnInit() {
    this.getSplitterOrientation();
  }

  ngAfterViewInit() {
    this.mapSize = 50;
    this.tableSize = 50;
    this.invalidateMapSize();
  }

  useMapExtent(event) {
    console.log('You clicked the map extent button', event);
  }

  closeTable() {
    this.mapSize = 100;
    this.tableSize = 0;
    this.visible = false;
    this.invalidateMapSize();
  }

  invalidateMapSize() {
    setTimeout(() => this.driveTimeMapComponent.map.invalidateSize(true), 100);
  }

  getSplitterOrientation() {
    if (window.innerWidth <= 599) {
      this.splitterOrientation = 'vertical';
    } else {
      this.splitterOrientation = 'horizontal';
    }
  }

  splitDragEnd(event: { gutterNum: number, sizes: number[] }) {
    console.log('splitDragEnd', event);
    this.mapSize = event.sizes[0];
    this.tableSize = event.sizes[1];
    this.invalidateMapSize();
  }

  onResize(event: Event) {
    this.getSplitterOrientation();
  }

  onWidthChange(event) {
    console.log('onWidthChange()', event);
    this.closeTable();
  }

}
