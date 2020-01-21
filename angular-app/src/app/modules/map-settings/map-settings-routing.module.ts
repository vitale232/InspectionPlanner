import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapSettingsDisplayComponent } from './map-settings-display/map-settings-display.component';
import { MapGalleryComponent } from './map-gallery/map-gallery.component';


const routes: Routes = [
  { path: '', component: MapSettingsDisplayComponent },
  { path: 'gallery', component: MapGalleryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapSettingsRoutingModule { }
