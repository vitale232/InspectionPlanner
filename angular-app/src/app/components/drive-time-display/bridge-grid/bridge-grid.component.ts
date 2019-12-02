import { Component, OnInit, OnDestroy } from '@angular/core';
import { createDS } from '@pebula/ngrid';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import * as config from './bridge-grid.config';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bridge-grid',
  templateUrl: './bridge-grid.component.html',
  styleUrls: ['./bridge-grid.component.css']
})
export class BridgeGridComponent implements OnInit {
  loading = true;

  bridges;
  bridgesDataSource = createDS()
    .onTrigger( () => this.getBridges() )
    .create();
  columns = config.COLUMNS.build();
  driveTimeID: number;

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => this.driveTimeID = parseInt(params.driveTimeID, 10));
  }

  ngOnInit() {
    console.log('bridgesDataSource', this.bridgesDataSource);
    console.log('columns', this.columns);
  }

  getBridges() {
    this.loading = false;
    return this.newYorkBridgeService.getAllDriveTimeBridges(this.driveTimeID);
    //   .subscribe((data) => {
    //     this.bridges = data;
    //     console.log('this.bridges', data);
    //   });
    // return this.bridges;
  }

}
