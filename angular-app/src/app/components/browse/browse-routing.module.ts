import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseDisplayComponent } from './browse-display/browse-display.component';

const routes: Routes = [
  { path: '', component: BrowseDisplayComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseRoutingModule { }
