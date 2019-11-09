import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveTimeDisplayRoutingModule } from './drive-time-display-routing.module';
import { DriveTimeDisplayComponent } from './drive-time-display.component';
import { DriveTimeMapComponent } from './drive-time-map/drive-time-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AngularSplitModule } from 'angular-split';


@NgModule({
  declarations: [
    DriveTimeDisplayComponent,
    DriveTimeMapComponent,
  ],
  imports: [
    CommonModule,
    DriveTimeDisplayRoutingModule,
    LeafletModule,
    AngularSplitModule,
  ]
})
export class DriveTimeDisplayModule { }
