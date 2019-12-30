import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseBridgesDisplayComponent } from './browse-bridges-display/browse-bridges-display.component';
import { BrowseBridgesRoutingModule } from './browse-bridges-routing.module';
import { AngularSplitModule } from 'angular-split';
import { MatButtonModule, MatProgressBarModule } from '@angular/material';
import { OpenLayersMapComponent } from '../../shared/components/open-layers-map/open-layers-map.component';
import { AttributeGridComponent } from 'src/app/shared/components/grid-components/attribute-grid/attribute-grid.component';
import { PblNgridModule, PblNgridComponent } from '@pebula/ngrid';
import { PblNgridDragModule } from '@pebula/ngrid/drag';
import { PblNgridTargetEventsModule } from '@pebula/ngrid/target-events';
import { PblNgridBlockUiModule } from '@pebula/ngrid/block-ui';
import { PblNgridTransposeModule } from '@pebula/ngrid/transpose';
import { PblNgridStickyModule } from '@pebula/ngrid/sticky';
import { PblNgridStatePluginModule } from '@pebula/ngrid/state';
import { PblNgridMaterialModule } from '@pebula/ngrid-material';
import { TemplateGridComponent } from 'src/app/shared/components/grid-components/template-grid/template-grid.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/components/shared.module';


@NgModule({
  declarations: [
    BrowseBridgesDisplayComponent,
  ],
  imports: [
    CommonModule,
    BrowseBridgesRoutingModule,
    AngularSplitModule,
    MaterialModule,

    SharedModule,

    PblNgridModule.withCommon([ { component: TemplateGridComponent } ]),
    PblNgridDragModule,
    PblNgridTargetEventsModule,
    PblNgridBlockUiModule,
    PblNgridTransposeModule,
    PblNgridStickyModule,
    PblNgridStatePluginModule,
    PblNgridMaterialModule,

  ],
  exports: [
    BrowseBridgesDisplayComponent,
  ]
})
export class BrowseBridgesModule { }
