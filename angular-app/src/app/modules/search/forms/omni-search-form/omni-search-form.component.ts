import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NominatimSearchService } from 'src/app/shared/services/nominatim-search.service';
import { Marker, SearchMarker } from 'src/app/shared/models/markers.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { NotificationsService } from 'angular2-notifications';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-omni-search-form',
  templateUrl: './omni-search-form.component.html',
  styleUrls: ['./omni-search-form.component.scss']
})
export class OmniSearchFormComponent implements OnInit {

  // @Output() loading = new EventEmitter<boolean>( false );
  loading: boolean;

  omniSearchForm = this.fb.group({
    searchText: new FormControl('', Validators.required)
  });

  constructor(
    private fb: FormBuilder,
    private nominatimSearchService: NominatimSearchService,
    private searchMarkersStore: SearchMarkersStoreService,
    private notifications: NotificationsService,
    private sidenav: SidenavService,
  ) { }

  ngOnInit() {
  }

  onSearch() {
    this.loading = true;
    this.nominatimSearchService.query(this.omniSearchForm.value.searchText).subscribe(
      resultArray => {
        if (resultArray.length === 0) {
          console.log('hi');
          this.notifications.error(
            'No Results',
            `The search text "${this.omniSearchForm.value.searchText}" did not return valid results.`
          );
        } else {
          const searchResult = resultArray[0];
          const searchMarker = new SearchMarker(
            [ parseFloat(searchResult.lon), parseFloat(searchResult.lat) ],
            searchResult,
            this.omniSearchForm.value.searchText
          );
          this.searchMarkersStore.searchMarkers = this.searchMarkersStore.searchMarkers.concat(searchMarker);
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
        setTimeout( () => this.sidenav.close(), 210 );
      }
    );
  }

}
