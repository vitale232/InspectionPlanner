import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowseBridgesDisplayComponent } from './browse-bridges-display/browse-bridges-display.component';


const routes: Routes = [
  { path: '', component: BrowseBridgesDisplayComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class BrowseBridgesRoutingModule { }
