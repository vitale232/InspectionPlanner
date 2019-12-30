import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/browse-bridges/browse-bridges.module').then( m => m.BrowseBridgesModule )
  },
  {
    path: 'drive-time/:driveTimeID',
    loadChildren: () => import('./modules/drive-time/drive-time.module').then( m => m.DriveTimeModule )
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
