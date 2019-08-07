import { Component, OnInit, ViewChild } from '@angular/core';
import { DriveTimeQueryApiResponse, DriveTimeQueryFeature } from '../../models/drive-time-queries.model';
import { DriveTimeQueryService } from 'src/app/services/drive-time-query.service';
import { MatDialog } from '@angular/material';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  detailsPanelOpen = false;
  pastPanelOpen = false;
  driveTimeQueriesData: DriveTimeQueryFeature;
  driveTimeQueriesText: Array<string>;
  driveTimeSearchToggle = false;
  selectedTimeInterval = 'fifteenMins';

  timeIntervals = [
    {value: 'fifteenMins', viewValue: '15 minutes'},
    {value: 'thirtyMins', viewValue: '30 minutes'},
    {value: 'fortyFiveMins', viewValue: '45 minutes'},
    {value: 'sixtyMins', viewValue: '1 hour'},
    {value: 'seventyFiveMins', viewValue: '1 hour 15 minutes'},
    {value: 'ninetyMins', viewValue: '1 hour 30 minutes'}
  ];

  constructor(
    private driveTimeQueryService: DriveTimeQueryService,
    public dialogRef: MatDialog,
  ) { }

  ngOnInit() {
    this.getRecentQueries();
  }

  onClick(): void {
    this.dialogRef.open(UnderConstructionComponent);
  }

  getRecentQueries() {
    this.driveTimeQueryService.getDriveTimeQueries(1)
      .subscribe(
        (data: DriveTimeQueryApiResponse) => {
          this.driveTimeQueriesData = (data.results) as any;
          const uniqueSearchText = (data.results.features) as any;

          // Push the first 50 characters of the address to an array
          const searchTextArray = [];
          uniqueSearchText.forEach((feature) => {
            searchTextArray.push({
              shortName: feature.properties.display_name.substring(0, 61) + '...',
              longName: feature.properties.display_name
            });
          });

          this.driveTimeQueriesText = Object.values(searchTextArray.reduce((unique, o) => {
            if (!unique[o.shortName]) {
              unique[o.shortName] = o;
            }

            return unique;
          }, {}));

          // // Filter addresses for unique values
          // this.driveTimeQueriesText = searchTextArray.filter((value, index, arr) => {
          //   // arr.indexOf will return the first occurrence of the value in the
          //   // original array. If the index is different, it must be a duplicate
          //   return arr.indexOf(value) === index;
          // }).slice(0, 10);
        },
        err => { },
        () => { }
      );
  }

}
