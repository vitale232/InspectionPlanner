import { Component, OnInit } from '@angular/core';
import { NewYorkBridgeFeature } from 'src/app/models/new-york-bridges.model';
import { MatTableDataSource } from '@angular/material';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bridge-table',
  templateUrl: './bridge-table.component.html',
  styleUrls: ['./bridge-table.component.css']
})
export class BridgeTableComponent implements OnInit {
  bridgeDataSource: MatTableDataSource<NewYorkBridgeFeature> | null;
  driveTimeID: number | null;

  subscriptions = new Subscription();
  displayedColumns = [ 'inspection', 'bin' , 'county', 'owner', 'structure', 'materials', 'aadt', ];

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe(
        params => {
          this.driveTimeID = params.driveTimeID;
          this.bridgeDataSource = null;
          this.newYorkBridgeService.getAllDriveTimeBridges(this.driveTimeID).subscribe(
            data => this.bridgeDataSource = new MatTableDataSource(data),
            bridgeErr => console.error(bridgeErr),
            () => console.log('bridgeDataSource!', this.bridgeDataSource)
          );
        },
        err => console.error(err),
        () => console.log('params complete')
      )
    );
  }

  onClick(row) {
    console.log('click row', row);
  }
}
