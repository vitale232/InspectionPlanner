import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkerClusterBrowseComponent } from './marker-cluster-browse/marker-cluster-browse.component';
import { MarkerClusterDriveTimeComponent } from './marker-cluster-drive-time/marker-cluster-drive-time.component';


const routes: Routes = [
  { path: '', component: MarkerClusterBrowseComponent },
  { path: 'drive-time/:driveTimeID', component: MarkerClusterDriveTimeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkerClusterRoutingModule { }
