import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss']
})
export class SearchHistoryComponent implements OnInit, OnDestroy {

  @Input() driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;

  displayedColumns: string[] = ['display_name', 'drive_time_hours'];

  dataSource: MatTableDataSource<IDriveTimeQueryFeature>;
  driveTimeQueriesSubscription: Subscription;

  constructor( private router: Router ) { }

  ngOnInit(): void {
    this.driveTimeQueriesSubscription = this.driveTimeQueries$.subscribe(
      queryFeatures => this.dataSource = new MatTableDataSource(queryFeatures.slice().sort(
        (a, b) => (a.properties.created_time < b.properties.created_time) ? 1 : -1)
      ),
      err => console.log(err),
    );
  }

  ngOnDestroy(): void {
    this.driveTimeQueriesSubscription.unsubscribe();
  }

  onClick(row: IDriveTimeQueryFeature): void {
    console.log('row', row);
    let zoom = 18;
    const hours = row.properties.drive_time_hours;
    if (hours <= 1.0) {
      zoom = 8;
    } else if (hours > 1.0) {
      zoom = 7;
    }
    const routerQueryParams = {
      lon: row.geometry.coordinates[0],
      lat: row.geometry.coordinates[1],
      z: zoom
    };

    this.router.navigate([`drive-time/${row.id}`], { queryParams: routerQueryParams });

  }

}
