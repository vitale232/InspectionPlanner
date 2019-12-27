import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchDisplayComponent } from './search-display/search-display.component';
import { OmniSearchFormComponent } from './forms/omni-search-form/omni-search-form.component';

import { MatInputModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatExpansionModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OsmFiltersFormComponent } from './forms/osm-filters-form/osm-filters-form.component';

@NgModule({
  declarations: [SearchDisplayComponent, OmniSearchFormComponent, OsmFiltersFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  exports: [
    SearchDisplayComponent,
  ]
})
export class SearchModule { }
