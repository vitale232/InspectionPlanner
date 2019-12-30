import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeGridComponent } from './grid-components/attribute-grid/attribute-grid.component';
import { TemplateGridComponent } from './grid-components/template-grid/template-grid.component';
import { OpenLayersMapComponent } from './open-layers-map/open-layers-map.component';

import { PblNgridModule } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';
import { MaterialModule } from '../../material.module';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { TemplateGridModule } from './grid-components/template-grid/template-grid.module';



@NgModule({
  declarations: [
    AttributeGridComponent,
    OpenLayersMapComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TemplateGridModule,
    PblNgridModule.withCommon([ { component: TemplateGridComponent } ]),
    PblNgridDragModule,
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridStatePluginModule,
    PblNgridMaterialModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    TemplateGridModule,
    AttributeGridComponent,
    OpenLayersMapComponent,
  ]
})
export class SharedModule { }
