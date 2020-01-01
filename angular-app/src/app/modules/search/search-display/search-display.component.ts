import { Component, OnInit } from '@angular/core';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { Observable } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { GeolocationStoreService } from 'src/app/shared/stores/geolocation-store.service';
import { GeolocationMarker } from 'src/app/shared/models/markers.model';
import { IGeoPosition } from 'src/app/shared/models/geolocation.model';

@Component({
  selector: 'app-search-display',
  templateUrl: './search-display.component.html',
  styleUrls: ['./search-display.component.scss']
})
export class SearchDisplayComponent implements OnInit {

  loading: boolean;
  driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;

  constructor(
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
    private searchMarkersStore: SearchMarkersStoreService,
    private geolocationStore: GeolocationStoreService,
  ) { }

  ngOnInit() {
    this.driveTimeQueries$ = this.driveTimeQueriesStore.driveTimeQueries$;
    this.geolocationStore.position$.subscribe(
      (position: IGeoPosition) => {
        console.log('geolocation object', position);
        if (position) {
          const geoLocation = new GeolocationMarker(
            [
              position.lon,
              position.lat
            ],
            position,
            'Test Geolocation Marker'
          );
          console.log('geolocationMarker', geoLocation);
        }
      },
      err => console.error('geolocation error', err),
      () => console.log('geolocation complete')
    );
  }

  onClearMarkers() {
    this.searchMarkersStore.searchMarkers  = [];
  }

  onSendMapHome() {
    console.log('TODO', 'implement onSendMapHome');
  }

  onSendClientLocation() {
    console.log('TODO', 'implement onSendClientLocation');
    console.log('onSendClientLocation() position', this.geolocationStore.position);
  }

}
