import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkerClusterRoutingModule } from './marker-cluster-routing.module';
import { MarkerClusterMapComponent } from './marker-cluster-map/marker-cluster-map.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [MarkerClusterMapComponent],
  imports: [
    CommonModule,
    MarkerClusterRoutingModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  exports: [MarkerClusterMapComponent]
})
export class MarkerClusterModule { }
