import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { createDS, PblNgridComponent } from '@pebula/ngrid';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import * as config from './bridge-grid.config';
import { ActivatedRoute } from '@angular/router';
import { NewYorkBridgeFeature } from 'src/app/models/new-york-bridges.model';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-bridge-grid',
  templateUrl: './bridge-grid.component.html',
  styleUrls: ['./bridge-grid.component.css'],
})
export class BridgeGridComponent implements OnInit, OnDestroy {
  driveTimeID: number;
  loading = true;
  subscriptions = new Subscription();
  useMapExtent = true;

  // Set up NGrid data structures. allBridgesDataSource will call a function that returns all pages from the API,
  // mapBridgesDataSource will call a function that returns the currently displayed bridges from the map. The rendered
  // dataSource is controlled by the useMapExtent flag. When true, mapBridgesDataSource. When false, allBridgesDataSource
  columns = config.COLUMNS.build();
  allBridgesDataSource = createDS()
    .keepAlive()
    .onTrigger( () => this.getAllBridges() )
    .create();
  mapBridgesDataSource = createDS()
    .keepAlive()
    .onTrigger( () => this.getMapBridges() )
    .create();

    @Output() tableWidth = new EventEmitter<number>();
    @ViewChild(PblNgridComponent, { static: true }) table: PblNgridComponent<NewYorkBridgeFeature>;

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        this.driveTimeID = parseInt(params.driveTimeID, 10);
        if (this.table) {
          this.refresh();
        }
      })
    );
  }

  ngOnDestroy() {
    delete this.allBridgesDataSource;
    delete this.mapBridgesDataSource;
  }

  getAllBridges(): Observable<NewYorkBridgeFeature[]> {
    return this.newYorkBridgeService.getAllDriveTimeBridges(this.driveTimeID);
  }

  getMapBridges() {
    return this.newYorkBridgeService.getDisplayedBridge$();
  }

  refresh(): void {
    if (this.table.ds) {
      this.table.ds.refresh();
    }
  }

  closeTable(): void {
    this.tableWidth.emit(0);
  }

  toggleUseMapExtent(): void {
    this.useMapExtent = !this.useMapExtent;
  }
}
