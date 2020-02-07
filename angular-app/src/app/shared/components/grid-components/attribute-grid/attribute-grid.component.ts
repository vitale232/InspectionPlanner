import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PblNgridColumnSet, PblDataSource, createDS, PblNgridComponent } from '@pebula/ngrid';
import { Observable } from 'rxjs';
import { IBridgeFeature, IBridgeProperties } from 'src/app/shared/models/bridges.model';

import * as config from './columns.config';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  styleUrls: ['./attribute-grid.component.scss']
})
export class AttributeGridComponent implements OnInit {

  @Input() bridges$: Observable<IBridgeFeature[]>;

  columns: PblNgridColumnSet = config.COLUMNS.build();

  mapBridgesDataSource: PblDataSource = createDS<IBridgeProperties>()
    .onTrigger( () => this.bridges$.pipe(
      filter(x => x !== null),
      map(bridgeFeatures => bridgeFeatures.map(bridge => bridge.properties))
    ))
    .create();

  @ViewChild(PblNgridComponent, { static: true }) table: PblNgridComponent<IBridgeFeature>;

  constructor() { }

  ngOnInit() {
  }

}
