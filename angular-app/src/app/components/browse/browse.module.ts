import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseDisplayComponent } from './browse-display/browse-display.component';
import { OpenLayersMapComponent } from './open-layers-map/open-layers-map.component';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  declarations: [BrowseDisplayComponent, OpenLayersMapComponent],
  imports: [
    CommonModule,
    MatProgressBarModule,
  ]
})
export class BrowseModule { }
