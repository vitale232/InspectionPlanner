import { Component, OnInit } from '@angular/core';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { Observable } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { GeolocationStoreService } from 'src/app/shared/stores/geolocation-store.service';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-display',
  templateUrl: './search-display.component.html',
  styleUrls: ['./search-display.component.scss']
})
export class SearchDisplayComponent implements OnInit {

  loading: boolean;
  driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
    private searchMarkersStore: SearchMarkersStoreService,
    private geolocationStore: GeolocationStoreService,
  ) { }

  ngOnInit() {
    this.driveTimeQueries$ = this.driveTimeQueriesStore.driveTimeQueries$;
  }

  onClearMarkers() {
    this.searchMarkersStore.searchMarkers  = [];
  }

  onSendMapHome() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: {
        lon: -75.8095,
        lat: 42.7757,
        z: 6
      }
    });
  }

  onSendClientLocation() {
    this.geolocationStore.fetchPosition();
  }

  onMapSettings() {
    this.router.navigate(['/map-settings'], { queryParamsHandling: 'merge' });
  }

  onMapGallery() {
    this.router.navigate(['/map-settings/gallery'], { queryParamsHandling: 'merge' });
  }
}
