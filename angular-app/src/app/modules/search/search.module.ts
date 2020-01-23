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
  MatSelectModule,
  MatTabsModule,
  MatProgressBarModule,
  MatTableModule,
  MatPaginatorModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OsmFiltersFormComponent } from './forms/osm-filters-form/osm-filters-form.component';
import { DriveTimeFormComponent } from './forms/drive-time-form/drive-time-form.component';
import { BridgeFiltersFormComponent } from './forms/bridge-filters-form/bridge-filters-form.component';
import { SearchHistoryComponent } from './search-history/search-history.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    SearchDisplayComponent,
    OmniSearchFormComponent,
    OsmFiltersFormComponent,
    DriveTimeFormComponent,
    BridgeFiltersFormComponent,
    SearchHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,

    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatTooltipModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  exports: [
    SearchDisplayComponent,
    SearchHistoryComponent,
  ]
})
export class SearchModule { }
