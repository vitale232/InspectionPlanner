import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapSettingsDisplayComponent } from './map-settings-display/map-settings-display.component';


const routes: Routes = [
  { path: '', component: MapSettingsDisplayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapSettingsRoutingModule { }
