import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateGridComponent } from './template-grid.component';
import { PblNgridModule } from '@pebula/ngrid';
import { MatProgressSpinnerModule, MatIconModule } from '@angular/material';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';


@NgModule({
  declarations: [
    TemplateGridComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    PblNgridModule,
    PblNgridDragModule.withDefaultTemplates(),
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridStickyModule,
    PblNgridMaterialModule,
  ],
  exports: [
    TemplateGridComponent,
  ]
})
export class TemplateGridModule { }
