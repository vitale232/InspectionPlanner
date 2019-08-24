import { Component, OnInit } from '@angular/core';
import { DriveTimeQueryApiResponse, DriveTimeQueryFeature } from '../../models/drive-time-queries.model';
import { MatDialog } from '@angular/material';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { SidenavService } from 'src/app/services/sidenav.service';
import { NominatimApiResponse, LocationSearchResult } from '../../models/location-search.model';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  detailsPanelOpen = false;
  pastPanelOpen = false;
  driveTimeQueriesText: Array<string>;
  driveTimeSearchToggle = false;
  selectedTimeInterval = 'fifteenMins';
  locationSearch: LocationSearchResult|null = null;

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
    private search: SearchService,
    public dialogRef: MatDialog,
    private fb: FormBuilder,
    private notifications: NotificationsService,
    private sidenav: SidenavService
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

    this.getLocationSearch(result.searchText);
  }

  getLocationSearch(query: string) {
    this.search.locationSearch(query)
      .subscribe(
        (data: Array<NominatimApiResponse>) => {

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
            (this.locationSearch as LocationSearchResult) = {
              lat: data[0].lat,
              lon: data[0].lon,
              z: 14,
              displayName: data[0].display_name,
              class: data[0].class,
              type: data[0].type,
              osmType: data[0].osm_type
            };
            this.search.sendLocationSearchResults(this.locationSearch);
            this.sidenav.close();
          }
        },
        err => {
          this.notifications.error(
            'Unhandled error',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
          });
        }
      );
  }

  getRecentQueries() {
    this.search.getDriveTimeQueries(1)
      .subscribe(
        (data: DriveTimeQueryApiResponse) => {
          const uniqueSearchText: Array<DriveTimeQueryFeature> = data.results.features;

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
        },
        err => {
          this.notifications.error(
            'Unhandled error',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, {
              timeOut: 20000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
          });
        }
      );
  }

  selectAll($event) {
    $event.target.select();
  }
}
