import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DriveTimeResultsMapComponent } from './components/drive-time-results-map/drive-time-results-map.component';


const routes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: 'drive-time-search',
    component: DriveTimeResultsMapComponent,
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
