import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkerClusterMapComponent } from './marker-cluster-map/marker-cluster-map.component';


const routes: Routes = [
  { path: '', component: MarkerClusterMapComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarkerClusterRoutingModule { }
