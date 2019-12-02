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
  ]
})
export class DriveTimeDisplayModule { }
