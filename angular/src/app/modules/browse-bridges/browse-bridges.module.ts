import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseBridgesDisplayComponent } from './browse-bridges-display/browse-bridges-display.component';
import { BrowseBridgesRoutingModule } from './browse-bridges-routing.module';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule } from '@angular/material';



@NgModule({
  declarations: [BrowseBridgesDisplayComponent],
  imports: [
    CommonModule,
    BrowseBridgesRoutingModule,
    AngularSplitModule,
    MatButtonModule,
  ],
  exports: [
    BrowseBridgesDisplayComponent,
  ]
})
export class BrowseBridgesModule { }
