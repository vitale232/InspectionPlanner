import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NominatimSearchService } from 'src/app/shared/services/nominatim-search.service';
import { Marker, SearchMarker } from 'src/app/shared/models/markers.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';

@Component({
  selector: 'app-omni-search-form',
  templateUrl: './omni-search-form.component.html',
  styleUrls: ['./omni-search-form.component.scss']
})
export class OmniSearchFormComponent implements OnInit {

  omniSearchForm = this.fb.group({
    searchText: new FormControl('', Validators.required)
  });

  constructor(
    private fb: FormBuilder,
    private nominatimSearchService: NominatimSearchService,
    private searchMarkersStore: SearchMarkersStoreService,
  ) { }

  ngOnInit() {
  }

  onSearch() {
    this.nominatimSearchService.query(this.omniSearchForm.value.searchText).subscribe(
      res => {
        const data = res[0];
        const searchMarker = new SearchMarker([ parseFloat(data.lon), parseFloat(data.lat) ], data);
        console.log('searchMarker', searchMarker);
        console.log('initMapMarker', searchMarker.initMapMarker());
        const markers = this.searchMarkersStore.searchMarkers;
        markers.push(searchMarker)
        this.searchMarkersStore.searchMarkers = markers.slice();
      },
      err => console.error('nominatim error', err),
      () => console.log('nominatim complete')
    );
  }

}
