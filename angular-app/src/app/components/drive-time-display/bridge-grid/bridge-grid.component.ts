import { Component, OnInit } from '@angular/core';
import { createDS } from '@pebula/ngrid';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';

@Component({
  selector: 'app-bridge-grid',
  templateUrl: './bridge-grid.component.html',
  styleUrls: ['./bridge-grid.component.css']
})
export class BridgeGridComponent implements OnInit {
  bridges;
  bridgesDataSource = createDS()
    .onTrigger( () => this.newYorkBridgeService.getAllDriveTimeBridges(520) )
    .create();

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
  ) { }

  ngOnInit() {
    console.log('bridgesDataSource', this.bridgesDataSource);
  }

  getBridges() {
    this.newYorkBridgeService.getAllDriveTimeBridges(520)
      .subscribe((data) => console.log('build ds?', this.bridges = data));
    return this.bridges;
  }

}
