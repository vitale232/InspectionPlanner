import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveTimeDisplayRoutingModule } from './drive-time-display-routing.module';
import { DriveTimeDisplayComponent } from './drive-time-display.component';
import { DriveTimeMapComponent } from './drive-time-map/drive-time-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularSplitModule } from 'angular-split';
import { BridgeTableComponent } from './bridge-table/bridge-table.component';
import { MatTableModule, MatProgressSpinnerModule, MatToolbarModule, MatButtonModule, MatIconModule } from '@angular/material';
import { BridgeGridComponent } from './bridge-grid/bridge-grid.component';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridDetailRowModule } from '@pebula/ngrid/detail-row';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';



@NgModule({
  declarations: [
    DriveTimeDisplayComponent,
    DriveTimeMapComponent,
    BridgeTableComponent,
    BridgeGridComponent,
  ],
  imports: [
    CommonModule,
    DriveTimeDisplayRoutingModule,
    LeafletModule,
    AngularSplitModule,
    MatTableModule,
    MatProgressSpinnerModule,
    PblNgridModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridDetailRowModule,
    PblNgridStickyModule,
    PblNgridStatePluginModule,
    PblNgridMaterialModule,
  ]
})
export class DriveTimeDisplayModule { }
