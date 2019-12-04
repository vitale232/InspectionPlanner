import { Component, OnInit, ViewChild, ChangeDetectionStrategy, Output, EventEmitter, OnDestroy } from '@angular/core';
import { createDS, PblNgridComponent, PblDataSource } from '@pebula/ngrid';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import * as config from './bridge-grid.config';
import { ActivatedRoute } from '@angular/router';
import { NewYorkBridgeFeature } from 'src/app/models/new-york-bridges.model';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { DriveTimeMapComponent } from '../drive-time-map/drive-time-map.component';


@Component({
  selector: 'app-bridge-grid',
  templateUrl: './bridge-grid.component.html',
  styleUrls: ['./bridge-grid.component.css'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
  //     state('*', style({height: '*', visibility: 'visible'})),
  //     transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BridgeGridComponent implements OnInit, OnDestroy {
  loading = true;
  subscriptions = new Subscription();

  bridges: NewYorkBridgeFeature[];
  bridgesDataSource = createDS()
    .keepAlive()
    .onTrigger( (event) => this.getBridges(event) )
    .create();
  displayedBridgesDataSource = createDS()
    .keepAlive()
    .onTrigger( () => this.getMapBridges() )
    .create();
  columns = config.COLUMNS.build();
  driveTimeID: number;
  selectedDataSource: PblDataSource;
  useMapExtent = false;

  @ViewChild(PblNgridComponent, { static: true }) table: PblNgridComponent<NewYorkBridgeFeature>;
  @ViewChild(DriveTimeMapComponent, { static: false }) private driveTimeMapComponent: DriveTimeMapComponent;
  @Output() tableWidth = new EventEmitter<number>();

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private route: ActivatedRoute,
  ) { this.selectedDataSource = this.bridgesDataSource; }

  ngOnInit() {
    this.subscriptions.add(
      this.newYorkBridgeService.getLoadingState$().subscribe(
        loadingState => this.loading = loadingState,
        (err) => console.error(err),
        () => console.log('loading sub complete!')
      )
    );
    this.subscriptions.add(
      this.route.params.subscribe(params => {
        console.log('params', params);
        this.driveTimeID = parseInt(params.driveTimeID, 10);
        if (this.table) {
          this.refresh();
        }
      })
    );
    this.subscriptions.add(
      this.newYorkBridgeService.getDisplayedBridge$().subscribe(
        data => console.log('displayedData', data),
        err => console.error(err),
        () => console.log('getDisplayBridge$ complete')
      )
    );
  }

  ngOnDestroy() {
    delete this.bridgesDataSource;
    delete this.displayedBridgesDataSource;
  }

  getBridges(event): Observable<NewYorkBridgeFeature[]> {
    this.loading = true;
    return this.newYorkBridgeService.getAllDriveTimeBridges(this.driveTimeID);
  }

  getMapBridges() {
    console.log('getMapBridges()', this.driveTimeMapComponent);
    return this.newYorkBridgeService.getDisplayedBridge$();
  }

  refresh(): void {
    console.log('table from refresh()', this.table);
    // this.newYorkBridgeService.sendLoadingState(true);
    if (this.table.ds) {
      this.table.ds.refresh();
      console.log('refreshed table.ds.refresh', this.table.ds);
    }
    this.newYorkBridgeService.sendLoadingState(false);
  }

  closeTable() {
    console.log('closeTable()', 0);
    this.tableWidth.emit(0);
  }

  toggleMapExtent() {
    this.useMapExtent = !this.useMapExtent;
    this.getMapBridges();
    if (this.useMapExtent) {
      console.log('should be bridge datasource');
      this.selectedDataSource = this.displayedBridgesDataSource;
    } else {
      console.log('should be display datasource');
      this.selectedDataSource = this.bridgesDataSource;
    }
    this.refresh();
  }
}
