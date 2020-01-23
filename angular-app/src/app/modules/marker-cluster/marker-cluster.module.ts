import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarkerClusterRoutingModule } from './marker-cluster-routing.module';
import { MarkerClusterMapComponent } from './marker-cluster-map/marker-cluster-map.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MatButtonModule, MatProgressSpinnerModule, MatProgressBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarkerClusterBrowseComponent } from './marker-cluster-browse/marker-cluster-browse.component';
import { MarkerClusterDriveTimeComponent } from './marker-cluster-drive-time/marker-cluster-drive-time.component';

@NgModule({
  declarations: [MarkerClusterMapComponent, MarkerClusterBrowseComponent, MarkerClusterDriveTimeComponent],
  imports: [
    CommonModule,
    MarkerClusterRoutingModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    FlexLayoutModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  exports: [MarkerClusterMapComponent, MarkerClusterBrowseComponent]
})
export class MarkerClusterModule { }
