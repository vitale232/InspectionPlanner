import { Component, OnInit, ViewChild, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { createDS, PblNgridComponent } from '@pebula/ngrid';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import * as config from './bridge-grid.config';
import { ActivatedRoute } from '@angular/router';
import { NewYorkBridgeFeature } from 'src/app/models/new-york-bridges.model';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';


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
export class BridgeGridComponent implements OnInit {
  loading = true;
  subscriptions = new Subscription();

  bridges: NewYorkBridgeFeature[];
  bridgesDataSource = createDS()
    .onTrigger( (event) => this.getBridges(event) )
    .create();
  columns = config.COLUMNS.build();
  driveTimeID: number;
  useMapExtent = false;

  @ViewChild(PblNgridComponent, { static: true }) table: PblNgridComponent<NewYorkBridgeFeature>;
  @Output() tableWidth = new EventEmitter<number>();

  constructor(
    private newYorkBridgeService: NewYorkBridgeService,
    private route: ActivatedRoute,
  ) {  }

  ngOnInit() {
    this.subscriptions.add(
      this.newYorkBridgeService.getLoadingState$().subscribe(
        loadingState => this.loading = loadingState,
        (err) => console.error(err),
        () => console.log('loading sub complete!')
      )
    );
    this.route.params.subscribe(params => {
      console.log('params', params);
      this.driveTimeID = parseInt(params.driveTimeID, 10);
      if (this.table) {
        this.refresh();
      }
    });
  }

  getBridges(event): Observable<NewYorkBridgeFeature[]> {
    this.loading = true;
    return this.newYorkBridgeService.getAllDriveTimeBridges(this.driveTimeID);
  }

  refresh(): void {
    console.log('table from refresh()', this.table);
    this.newYorkBridgeService.sendLoadingState(true);
    if (this.table.ds) {
      this.table.ds.refresh();
      console.log('refreshed table.ds.refresh', this.table.ds);
    }
  }

  closeTable() {
    console.log('closeTable()', 0);
    this.tableWidth.emit(0);
  }
}
