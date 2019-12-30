import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriveTimeDisplayComponent } from './drive-time-display/drive-time-display.component';


const routes: Routes = [{ path: '', component: DriveTimeDisplayComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriveTimeRoutingModule { }
