import { Component, OnInit } from '@angular/core';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { Observable } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';

@Component({
  selector: 'app-search-display',
  templateUrl: './search-display.component.html',
  styleUrls: ['./search-display.component.scss']
})
export class SearchDisplayComponent implements OnInit {

  driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;

  constructor(
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
  ) { }

  ngOnInit() {
    this.driveTimeQueries$ = this.driveTimeQueriesStore.driveTimeQueries$;
  }

}
