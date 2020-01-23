import { Component, OnInit } from '@angular/core';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { Observable } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';

@Component({
  selector: 'app-cluster-drive-time-form',
  templateUrl: './cluster-drive-time-form.component.html',
  styleUrls: ['./cluster-drive-time-form.component.scss']
})
export class ClusterDriveTimeFormComponent implements OnInit {

  driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;

  constructor( private driveTimeQueriesStore: DriveTimeQueriesStoreService ) {
    this.driveTimeQueries$ = this.driveTimeQueriesStore.driveTimeQueries$;
  }

  ngOnInit() {
  }

}
