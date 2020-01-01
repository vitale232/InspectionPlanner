import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NominatimSearchService } from 'src/app/shared/services/nominatim-search.service';
import { NotificationsService } from 'angular2-notifications';
import { SearchMarker } from 'src/app/shared/models/markers.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-osm-filters-form',
  templateUrl: './osm-filters-form.component.html',
  styleUrls: ['./osm-filters-form.component.scss']
})
export class OsmFiltersFormComponent implements OnInit {

  loading = false;
  osmFilterForm = this.fb.group({
    streetAddress: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('NY'),
    country: new FormControl('USA')
  });

  constructor(
    private fb: FormBuilder,
    private nominatimSearchService: NominatimSearchService,
    private notifications: NotificationsService,
    private searchMarkersStore: SearchMarkersStoreService,
    private sidenav: SidenavService,
  ) { }

  ngOnInit() {
  }

  onSearch(): void {
    this.loading = true;
    const osmQuery = this.osmFilterForm.value;
    const query = `street_address: "${osmQuery.streetAddress}"; ` +
                  `city: "${osmQuery.city}"; ` +
                  `state: "${osmQuery.state}"; ` +
                  `country: "${osmQuery.country}"; `;
    this.nominatimSearchService.paramQuery(this.osmFilterForm.value).subscribe(
      data => {
        if (data.length === 0) {
          // Handle empty nominatim requests by alerting user of invalid search
          this.notifications.error(
            'No Results',
            `The search text "${query}" did not return valid results.`
          );
        } else {
          const searchResult = data[0];
          const searchMarker = new SearchMarker(
            [ parseFloat(searchResult.lon), parseFloat(searchResult.lat) ],
            searchResult,
            query
          );
          this.searchMarkersStore.searchMarkers = this.searchMarkersStore
                                                      .searchMarkers
                                                      .concat(searchMarker);
        }
      },
      err => {
        console.error('nominatim error', err);
        this.notifications.error(
          'Unhandled Error',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
        );
        this.loading = false;
      },
      () => {
        this.loading = false;
        setTimeout( () => this.sidenav.close(), 500 );
      }
    );
  }
}
