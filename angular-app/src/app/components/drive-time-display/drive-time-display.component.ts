import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drive-time-display',
  templateUrl: './drive-time-display.component.html',
  styleUrls: ['./drive-time-display.component.css']
})
export class DriveTimeDisplayComponent implements OnInit {
  splitterOrientation = 'horizontal';

  constructor() { }

  ngOnInit() {
    this.getSplitterOrientation();
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
