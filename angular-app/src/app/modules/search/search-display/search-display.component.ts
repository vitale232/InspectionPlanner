import { Component, OnInit } from '@angular/core';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { Observable, Subscription } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { GeolocationStoreService } from 'src/app/shared/stores/geolocation-store.service';

import { Router, ActivatedRoute } from '@angular/router';
import { BrowserHistoryService } from 'src/app/shared/services/browser-history.service';


@Component({
  selector: 'app-search-display',
  templateUrl: './search-display.component.html',
  styleUrls: ['./search-display.component.scss']
})
export class SearchDisplayComponent implements OnInit {

  loading: boolean;
  driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;
  defaultSearch = true;
  subscriptions = new Subscription();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
    private searchMarkersStore: SearchMarkersStoreService,
    private geolocationStore: GeolocationStoreService,
    private browserHistory: BrowserHistoryService,
  ) { }

  ngOnInit() {
    this.driveTimeQueries$ = this.driveTimeQueriesStore.driveTimeQueries$;
    this.subscriptions.add(this.browserHistory.currentUrl$.subscribe(
      data => {
        if (data) {
          const urlParts = data.split(/[?,&,/]/).map(x => x.replace('/', ''));
          if (urlParts.includes('marker-cluster')) {
            this.defaultSearch = false;
          } else {
            this.defaultSearch = true;
          }
        } else {
          this.defaultSearch = true;
        }
      }
    ));
  }

  onClearMarkers() {
    this.searchMarkersStore.searchMarkers  = [];
  }

  onSendMapHome() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
      queryParams: {
        lon: -75.809500,
        lat: 42.775700,
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
