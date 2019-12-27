import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as config from './columns.config';
import { PblNgridColumnSet, PblDataSource, createDS, PblNgridComponent } from '@pebula/ngrid';
import { Observable } from 'rxjs';
import { BridgeFeature } from 'src/app/shared/models/bridges.model';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  styleUrls: ['./attribute-grid.component.scss']
})
export class AttributeGridComponent implements OnInit {

  @Input() bridges$: Observable<BridgeFeature[]>;

  columns: PblNgridColumnSet = config.COLUMNS.build();
  mapBridgesDataSource: PblDataSource = createDS()
    .keepAlive()
    .onTrigger( () => this.getBBoxBridges() )
    .create();

  @ViewChild(PblNgridComponent, { static: true }) table: PblNgridComponent<BridgeFeature>;

  constructor() { }

  ngOnInit() {
  }

  getBBoxBridges(): Observable<BridgeFeature[]> {
    return this.bridges$;
  }

}
