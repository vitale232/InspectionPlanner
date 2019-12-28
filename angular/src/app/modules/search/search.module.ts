import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchDisplayComponent } from './search-display/search-display.component';
import { OmniSearchFormComponent } from './forms/omni-search-form/omni-search-form.component';

import {
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MatOptionModule,
  MatTooltipModule,
  MatSelectModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OsmFiltersFormComponent } from './forms/osm-filters-form/osm-filters-form.component';
import { DriveTimeFormComponent } from './forms/drive-time-form/drive-time-form.component';

@NgModule({
  declarations: [SearchDisplayComponent, OmniSearchFormComponent, OsmFiltersFormComponent, DriveTimeFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatTooltipModule,
    MatSelectModule,
  ],
  exports: [
    SearchDisplayComponent,
  ]
})
export class SearchModule { }
