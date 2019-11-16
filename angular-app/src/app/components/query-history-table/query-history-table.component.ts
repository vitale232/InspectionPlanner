import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { IDriveTimeQueryApiResponse, IDriveTimeQueryFeature } from 'src/app/models/drive-time-queries.model';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';

@Component({
  selector: 'app-query-history-table',
  templateUrl: './query-history-table.component.html',
  styleUrls: ['./query-history-table.component.css']
})
export class QueryHistoryTableComponent implements OnInit {
  recentQueries: MatTableDataSource<IDriveTimeQueryFeature['properties']>;
  displayedColumns: string[] = ['display_name', 'drive_time_hours'];

  constructor(
    private searchService: SearchService,
    private router: Router,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.getRecentQueries();
  }

  getRecentQueries() {
    this.searchService.getDriveTimeQueries(1)
      .subscribe(
        (data: IDriveTimeQueryApiResponse) => {
          const features = data.results.features;
          const queryProperties = [];
          features.forEach(element => {
            queryProperties.push({
              drive_time_hours: element.properties.drive_time_hours,
              display_name: element.properties.display_name,
              id: element.id,
              lat: element.properties.lat,
              lon: element.properties.lon,
              polygon_pending: element.properties.polygon_pending,
              search_text: element.properties.search_text,
              });
            });
          this.recentQueries = new MatTableDataSource(queryProperties);
        },
        (err) => console.error(err),
      );
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
