import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapSettingsRoutingModule } from './map-settings-routing.module';
import { MapSettingsComponent } from './map-settings/map-settings.component';
import { SharedModule } from 'src/app/shared/components/shared.module';
import { MatInputModule, MatCardModule } from '@angular/material';


@NgModule({
  declarations: [ MapSettingsComponent, ],
  imports: [
    CommonModule,
    MapSettingsRoutingModule,

    SharedModule,

    MatInputModule,
    MatCardModule,
  ],
  exports: [ MapSettingsComponent ],
})
export class MapSettingsModule { }
