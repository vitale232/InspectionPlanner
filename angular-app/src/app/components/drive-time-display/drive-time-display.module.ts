import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveTimeDisplayRoutingModule } from './drive-time-display-routing.module';
import { DriveTimeDisplayComponent } from './drive-time-display.component';


@NgModule({
  declarations: [DriveTimeDisplayComponent],
  imports: [
    CommonModule,
    DriveTimeDisplayRoutingModule
  ]
})
export class DriveTimeDisplayModule { }
