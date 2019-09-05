import { Component, OnInit } from '@angular/core';
import { DriveTimeQueryApiResponse, DriveTimeQueryFeature } from '../../models/drive-time-queries.model';
import { MatDialog } from '@angular/material';
import { UnderConstructionComponent } from '../under-construction/under-construction.component';
import { FormBuilder } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { SidenavService } from 'src/app/services/sidenav.service';
import { NominatimApiResponse, LocationSearchResult, FilterSearch } from '../../models/location-search.model';
import { SearchService } from 'src/app/services/search.service';
import { ClientLocationService } from 'src/app/services/client-location.service';
import { MapExtent } from 'src/app/models/map-tools.model';
import { MapToolsService } from 'src/app/services/map-tools.service';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { BridgeQuery } from 'src/app/models/bridge-query.model';


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
  bridgeSearchToggle = false;
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

  filterForm = this.fb.group({
    streetAddress: [''],
    city: [''],
    state: ['NY'],
    country: ['USA']
  });

  bridgeForm = this.fb.group({
    bin: [''],
    carried: [''],
    county: [''],
    commonName: [''],
  });

  constructor(
    private searchService: SearchService,
    public dialogRef: MatDialog,
    private fb: FormBuilder,
    private notifications: NotificationsService,
    private sidenavService: SidenavService,
    private clientLocationService: ClientLocationService,
    private mapToolsService: MapToolsService,
    private newYorkBridgeService: NewYorkBridgeService
  ) { }

  ngOnInit() {
    this.getRecentQueries();
  }

  onClick(): void {
    this.dialogRef.open(UnderConstructionComponent);
  }

  sendClientLocation() {
    this.clientLocationService.queryClientLocation();
  }

  sendMapHome() {
    const mapExtent: MapExtent = {
      lat: 43.0,
      lon: -75.3,
      z: 7
    };
    this.mapToolsService.sendMapHome(mapExtent);
  }

  onClearMarkers() {
    this.mapToolsService.sendClearMarkers(true);
  }

  onFilterSearch() {
    this.getFilterSearch(this.filterForm.value);
  }

  getFilterSearch(filterSearch: FilterSearch) {
    this.searchService.filterSearch(filterSearch)
      .subscribe(
        (data: Array<NominatimApiResponse>) => {

          if (data.length === 0) {
            const query = `street: "${filterSearch.streetAddress}"; ` +
              `city: "${filterSearch.city}"; state: "${filterSearch.state}"; ` +
              `country: "${filterSearch.country}"`;
            this.notifications.error(
              'Search error',
              `No results found for query: ${query}`, {
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
            this.searchService.sendLocationSearchResult(this.locationSearch);
            this.sidenavService.close();
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

  onLocationSearch() {
    const location = Object.assign({}, this.locationForm.value);
    location.locationForm = Object.assign({}, location.locationForm);

    const binRegex = /^\d{6,7}$/;
    const match = binRegex.test(location.searchText);
    console.log(`${location.searchText} is a match: ${match}`);
    if (match) {
      this.getBinSearch(location.searchText);
    } else {
      this.getLocationSearch(location.searchText);
    }
  }

  onBridgeSearch(): void {
    this.getBridgeSearch(this.bridgeForm.value);
  }

  getBridgeSearch(bridgeQuery: BridgeQuery): void {
    this.newYorkBridgeService.searchNewYorkBridgesQuery(bridgeQuery)
      .subscribe(data => {
        if (data.count === 0) {
          const query = `bin: "${bridgeQuery.bin}"; ` +
            `carried: "${bridgeQuery.carried}"; ` +
            `county: "${bridgeQuery.county}"; ` +
            `common_name: "${bridgeQuery.commonName}"; `;
          this.notifications.error(
            'Search error',
            `No results found for query: "${query}"`, {
              timeOut: 10000,
              showProgressBar: true,
              pauseOnHover: true,
              clickToClose: true
          });
        } else {
          if (data.count > 1) {

            this.notifications.info(
              'Returned many records',
              `Displaying 1 of ${data.count} possible results`, {
                timeOut: 10000,
                showProgressBar: true,
                pauseOnHover: true,
                clickToClose: true
            });
          }
          this.newYorkBridgeService
            .sendBridgeFeature(data.results.features[0]);
        }

      }
    );
  }

  getBinSearch(bin: string): void {
    this.newYorkBridgeService.searchNewYorkBridgesBin(bin)
      .subscribe((data) => this.newYorkBridgeService
        .sendBridgeFeature(data.results.features[0]));
  }

  getLocationSearch(query: string) {
    this.searchService.locationSearch(query)
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
            this.searchService.sendLocationSearchResult(this.locationSearch);
            this.sidenavService.close();
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
    this.searchService.getDriveTimeQueries(1)
      .subscribe(
        (data: DriveTimeQueryApiResponse) => {
          const uniqueSearchText: Array<DriveTimeQueryFeature> = data.results.features;

          // Create an array of objects with two properties:
          // 1) first 61 characters of address  2) full address
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
