import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapSettingsRoutingModule } from './map-settings-routing.module';
import { MapSettingsComponent } from './map-settings/map-settings.component';
import { SharedModule } from 'src/app/shared/components/shared.module';
import {
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSlideToggleModule,
} from '@angular/material';
import { SymbologyFormComponent } from './symbology-form/symbology-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { SymbologyPreviewComponent } from './symbology-preview/symbology-preview.component';


@NgModule({
  declarations: [ MapSettingsComponent, SymbologyFormComponent, SymbologyPreviewComponent, ],
  imports: [
    CommonModule,
    MapSettingsRoutingModule,
    FlexLayoutModule,
    ReactiveFormsModule,

    SharedModule,

    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSlideToggleModule,
  ],
  exports: [ MapSettingsComponent ],
})
export class MapSettingsModule { }
