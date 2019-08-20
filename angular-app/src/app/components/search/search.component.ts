import { Component, OnInit, ViewChild } from '@angular/core';
import { DriveTimeQueryApiResponse, DriveTimeQueryFeature } from '../../models/drive-time-queries.model';
import { DriveTimeQueryService } from 'src/app/services/drive-time-query.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';


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
  searchExtent = null;

  timeIntervals = [
    {value: 'fifteenMins', viewValue: '15 minutes'},
    {value: 'thirtyMins', viewValue: '30 minutes'},
    {value: 'fortyFiveMins', viewValue: '45 minutes'},
    {value: 'sixtyMins', viewValue: '1 hour'},
    {value: 'seventyFiveMins', viewValue: '1 hour 15 minutes'},
    {value: 'ninetyMins', viewValue: '1 hour 30 minutes'}
  ];

  locationForm = this.fb.group({
    searchText: ['']
  });

  constructor(
    private driveTimeQueryService: DriveTimeQueryService,
    public dialogRef: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private notifications: NotificationsService,
  ) { }

  ngOnInit() {
    this.getRecentQueries();
  }

  onClick(): void {
    this.dialogRef.open(UnderConstructionComponent);
  }

  onLocationSearch() {
    const result = Object.assign({}, this.locationForm.value);
    result.locationForm = Object.assign({}, result.locationForm);

    const locationQuery = {
      q: result.searchText,
      lat: 43.0,
      lon: -75.3
    };
    this.getSearchLocation(result.searchText);
    this.driveTimeQueryService.sendMapExtent(this.searchExtent);
  }

  getSearchLocation(query: string) {
    this.driveTimeQueryService.locationSearch(query)
      .subscribe(
        (data: any) => {

          if (data.length === 0) {
            this.notifications.error(
              'Search error',
              `No results found for query: "${query}"`, {
                timeOut: 10000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true
            });
          } else {
            this.searchExtent = {
              lat: data[0].lat,
              lon: data[0].lon,
              z: 14
            };
            if (data[0].display_name) {
              this.searchExtent.displayName = data[0].display_name;
            }
            if (data[0].class) {
              this.searchExtent.class = data[0].class;
            }
            if (data[0].type) {
              this.searchExtent.type = data[0].type;
            }
            if (data[0].osm_type) {
              this.searchExtent.osmType = data[0].osm_type;
            }
          }
        },
        err => {

          console.log(`don't look now... it's an err`);
          console.log(err);
        },
        () => {
          this.driveTimeQueryService.sendMapExtent(this.searchExtent);
        }
      );
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

          // Filter addresses for unique values
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

  openSnackbar(message: string, duration: number = 2500) {
    this.snackBar.open(message, 'Dismiss', {
      duration,
      panelClass: ['snackbar'],
      horizontalPosition: 'start'
    });
  }
}
