import { Component, OnInit } from '@angular/core';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { Observable } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';

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
  ) { }

  ngOnInit() {
    this.driveTimeQueries$ = this.driveTimeQueriesStore.driveTimeQueries$;
  }

  onClearMarkers() {
    this.searchMarkersStore.searchMarkers  = [];
  }

}
