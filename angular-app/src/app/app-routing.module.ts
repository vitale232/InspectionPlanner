import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MapComponent } from './components/map/map.component';


const routes: Routes = [
  {
    path: '',
    component: MapComponent,
  },
  {
    path: 'drive-time/:driveTimeID',
    loadChildren: () => import('./components/drive-time-display/drive-time-display.module').then(m => m.DriveTimeDisplayModule)
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
