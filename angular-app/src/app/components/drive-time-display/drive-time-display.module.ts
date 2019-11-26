import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveTimeDisplayRoutingModule } from './drive-time-display-routing.module';
import { DriveTimeDisplayComponent } from './drive-time-display.component';
import { DriveTimeMapComponent } from './drive-time-map/drive-time-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularSplitModule } from 'angular-split';
import { BridgeTableComponent } from './bridge-table/bridge-table.component';
import { MatTableModule } from '@angular/material';


@NgModule({
  declarations: [
    DriveTimeDisplayComponent,
    DriveTimeMapComponent,
    BridgeTableComponent,
  ],
  imports: [
    CommonModule,
    DriveTimeDisplayRoutingModule,
    LeafletModule,
    AngularSplitModule,
    MatTableModule,
  ]
})
export class DriveTimeDisplayModule { }
