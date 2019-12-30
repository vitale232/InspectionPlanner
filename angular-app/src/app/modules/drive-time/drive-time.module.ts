import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriveTimeRoutingModule } from './drive-time-routing.module';
import { DriveTimeDisplayComponent } from './drive-time-display/drive-time-display.component';
import { AttributeGridComponent } from 'src/app/shared/components/grid-components/attribute-grid/attribute-grid.component';
import { TemplateGridComponent } from 'src/app/shared/components/grid-components/template-grid/template-grid.component';
import { OpenLayersMapComponent } from 'src/app/shared/components/open-layers-map/open-layers-map.component';
import { AngularSplitModule } from 'angular-split';
import { MaterialModule } from 'src/app/material.module';
import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';
import { SharedModule } from 'src/app/shared/components/shared.module';


@NgModule({
  declarations: [
    DriveTimeDisplayComponent,
  ],
  imports: [
    CommonModule,
    DriveTimeRoutingModule,
    AngularSplitModule,
    MaterialModule,

    SharedModule,

    PblNgridModule.withCommon([ { component: TemplateGridComponent } ]),
    PblNgridDragModule,
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridStickyModule,
    PblNgridMaterialModule,
  ],
  exports: [
    DriveTimeDisplayComponent,
  ]
})
export class DriveTimeModule { }
