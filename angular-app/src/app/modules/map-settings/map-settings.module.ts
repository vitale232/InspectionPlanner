import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapSettingsRoutingModule } from './map-settings-routing.module';
import { SharedModule } from 'src/app/shared/components/shared.module';
import {
  MatInputModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatGridListModule,
} from '@angular/material';
import { SymbologyFormComponent } from './numeric-fields/symbology-form/symbology-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { SymbologyPreviewComponent } from './numeric-fields/symbology-preview/symbology-preview.component';
import { MapSettingsDisplayComponent } from './map-settings-display/map-settings-display.component';
import { CategoricalColorsComponent } from './categorical-colors/categorical-colors.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MapGalleryComponent } from './map-gallery/map-gallery.component';


@NgModule({
  declarations: [
    MapSettingsDisplayComponent,
    SymbologyFormComponent,
    SymbologyPreviewComponent,
    CategoricalColorsComponent,
    MapGalleryComponent,
  ],
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
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatGridListModule,
    ColorPickerModule,
  ],
  exports: [ MapSettingsDisplayComponent ],
})
export class MapSettingsModule { }
