import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseBridgesDisplayComponent } from './browse-bridges-display/browse-bridges-display.component';
import { BrowseBridgesRoutingModule } from './browse-bridges-routing.module';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule, MatProgressBarModule } from '@angular/material';
import { OpenLayersMapComponent } from '../../shared/components/open-layers-map/open-layers-map.component';


@NgModule({
  declarations: [BrowseBridgesDisplayComponent, OpenLayersMapComponent],
  imports: [
    CommonModule,
    BrowseBridgesRoutingModule,
    AngularSplitModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  exports: [
    BrowseBridgesDisplayComponent,
  ]
})
export class BrowseBridgesModule { }
