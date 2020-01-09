import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapSettingsComponent } from './map-settings/map-settings.component';


const routes: Routes = [
  { path: '', component: MapSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapSettingsRoutingModule { }
