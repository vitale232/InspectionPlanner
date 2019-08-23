import { Component, OnInit } from '@angular/core';
import { DriveTimeQueryApiResponse, DriveTimeQueryFeature } from '../../models/drive-time-queries.model';
import { DriveTimeQueryService } from 'src/app/services/drive-time-query.service';
import { MatDialog } from '@angular/material';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { SidenavService } from 'src/app/services/sidenav.service';
import { NominatimApiResponse, LocationSearchResult } from '../../models/location-search.model';


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
    private driveTimeQueryService: DriveTimeQueryService,
    public dialogRef: MatDialog,
    private fb: FormBuilder,
    private notifications: NotificationsService,
    private sidenavService: SidenavService
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
  }

  getSearchLocation(query: string) {
    this.driveTimeQueryService.locationSearch(query)
      .subscribe(
        (data: NominatimApiResponse[]) => {

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
            (this.locationSearch as any) = {
              lat: data[0].lat,
              lon: data[0].lon,
              z: 14
            };
            if (data[0].display_name) {
              this.locationSearch.displayName = data[0].display_name;
            }
            if (data[0].class) {
              this.locationSearch.class = data[0].class;
            }
            if (data[0].type) {
              this.locationSearch.type = data[0].type;
            }
            if (data[0].osm_type) {
              this.locationSearch.osmType = data[0].osm_type;
            }
            this.driveTimeQueryService.sendLocationSearchResults(this.locationSearch);
            this.sidenavService.close();
          }
        },
        err => {

          console.log(`don't look now... it's an err`);
          console.log(err);
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
        },
        err => { },
        () => { }
      );
  }

  selectAll($event) {
    $event.target.select();
  }
}
