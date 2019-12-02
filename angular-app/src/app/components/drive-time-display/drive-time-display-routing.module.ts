import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriveTimeDisplayComponent } from './drive-time-display.component';
import { BridgeGridComponent } from './bridge-grid/bridge-grid.component';

const routes: Routes = [
  { path: '', component: DriveTimeDisplayComponent },
  { path: 'grid-test', component: BridgeGridComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriveTimeDisplayRoutingModule { }
