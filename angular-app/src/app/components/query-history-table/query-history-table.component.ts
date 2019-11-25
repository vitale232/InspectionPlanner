import { Component, OnInit, OnDestroy } from '@angular/core';
import { IQueryProperties } from 'src/app/models/drive-time-queries.model';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';
import { DriveTimeQueryService } from 'src/app/services/drive-time-query.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-query-history-table',
  templateUrl: './query-history-table.component.html',
  styleUrls: ['./query-history-table.component.css']
})
export class QueryHistoryTableComponent implements OnInit, OnDestroy {
  recentQueries: MatTableDataSource<IQueryProperties>;
  displayedColumns: string[] = ['display_name', 'drive_time_hours'];
  subscriptions = new Subscription();

  constructor(
    private router: Router,
    private sidenavService: SidenavService,
    private driveTimeQueryService: DriveTimeQueryService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.driveTimeQueryService.receiveRecentQueriesArray$().subscribe(
        data => {
          console.log('data from ngOnInit query table', data);
          this.recentQueries = new MatTableDataSource(data);
          this.driveTimeQueryService.originalDriveTimeQueryCount = data.length;
        },
        err => console.error(err),
        () => console.log('complete ngOnInit')
      )
    );
    this.getRecentQueries();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getRecentQueries() {
    this.driveTimeQueryService.getRecentQueries(1);
  }

  onClick(row) {
    this.sidenavService.close();
    let zoom = null;
    if (row.drive_time_hours > 1.0) {
      zoom = 8;
    } else if (row.drive_time_hours >= 0.5 && row.drive_time_hours <= 1.0) {
      zoom = 9;
    } else {
      zoom = 10;
    }

    if (!zoom) {
      zoom = 7;
    }

    this.router.navigate([`/drive-time/${row.id}`], { queryParams: { lat: row.lat, lon: row.lon, z: zoom} });
  }

}
