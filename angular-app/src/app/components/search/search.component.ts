import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnDestroy {
  detailsPanelOpen = false;
  pastPanelOpen = false;
  driveTimeQueriesText: Array<string>;
  driveTimeSearchToggle = false;
  bridgeSearchToggle = false;
  searchLoading = false;
  selectedTimeInterval = 'fifteenMins';
  locationSearch: LocationSearchResult|null = null;
  subscriptions = new Subscription();
  notificationSettings = {
    timeOut: 15000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

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

  driveTimeForm = this.fb.group({
    searchText: [''],
    driveTimeHours: this.timeIntervals[1].value
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
    private newYorkBridgeService: NewYorkBridgeService,
    private router: Router,
  ) { }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  onToggleChange(event: Event) {
    if (this.driveTimeSearchToggle) {
      this.driveTimeForm.patchValue({
        searchText: this.locationForm.value.searchText,
        driveTimeHours: this.driveTimeForm.value.driveTimeHours
      });
    } else {
      this.locationForm.patchValue({
        searchText: this.driveTimeForm.value.searchText
      });
    }
  }

  onDriveTimeQuery(): void {
    this.searchLoading = true;
    let driveTimeHours = this.driveTimeForm.value.driveTimeHours;
    switch (driveTimeHours) {
      case 'fifteenMins':
        driveTimeHours = '0.25';
        break;
      case 'thirtyMins':
        driveTimeHours = '0.50';
        break;
      case 'fortyFiveMins':
        driveTimeHours = '0.75';
        break;
      case 'sixtyMins':
        driveTimeHours = '1.00';
        break;
      case 'seventyFiveMins':
        driveTimeHours = '1.25';
        break;
      case 'ninetyMins':
        driveTimeHours = '1.50';
        break;
    }
    const requestQueryParams = {
      q: this.driveTimeForm.value.searchText,
      drive_time_hours: driveTimeHours,
      return_bridges: false
    };
    this.searchService.getNewDriveTimeQuery(requestQueryParams).subscribe((data: any) => {
      if (data.id) {
        this.handleExistingDriveTimeQuery(data, driveTimeHours);
      } else if (data.msg === 'The request has been added to the queue') {
        this.notifications.info(
          'Hold up!',
          `This is a new drive time request, which takes a while to process. ` +
          `Check the "Search History" for your results in a bit. Note: ` +
          `The longer the drive time, the longer the wait!`, this.notificationSettings);
      }
    },
    err => {
      console.error(err);
      if (err.status === 400) {
        this.notifications.error(
          'Search error',
          'The search location is not within the extent of the routable network. ' +
          'Search for a place that lies within the blue box on the map.', this.notificationSettings);
        } else if(err.status === 404) {
          this.notifications.error(
            'Search error',
            `No results found for query: ${this.driveTimeForm.value.searchText}`, this.notificationSettings);
        } else {
          this.notifications.error(
            'Unhandled error',
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, this.notificationSettings);
        }
      this.searchLoading = false;
    },
    () => this.searchLoading = false);
  }

  handleExistingDriveTimeQuery(data: any, inputDriveTimeHours: string) {
    const driveTimeId = data.id;
    const driveTimeHours = parseFloat(inputDriveTimeHours);
    let zoom = null;
    if (driveTimeHours > 1.0) {
      zoom = 8;
    } else if (driveTimeHours >= 0.5 && driveTimeHours <= 1.0) {
      zoom = 9;
    } else {
      zoom = 10;
    }

    if (!zoom) {
      zoom = 7;
    }

    const driveTimeQueryParams = {
      lat: data.geometry.coordinates[1],
      lon: data.geometry.coordinates[0],
      z: zoom
    };
    this.router.navigate([`/drive-time/${driveTimeId}`], { queryParams: driveTimeQueryParams });
    this.sidenavService.close();

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
    this.searchLoading = true;
    this.subscriptions.add(this.searchService.filterSearch(filterSearch)
      .subscribe(
        (data: Array<NominatimApiResponse>) => {

          if (data.length === 0) {
            const query = `street: "${filterSearch.streetAddress}"; ` +
              `city: "${filterSearch.city}"; state: "${filterSearch.state}"; ` +
              `country: "${filterSearch.country}"`;
            this.notifications.error(
              'Search error',
              `No results found for query: ${query}`, this.notificationSettings);
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
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, this.notificationSettings);
          this.searchLoading = false;
        },
        () => this.searchLoading = false
      ));
  }

  onLocationSearch() {
    const location = Object.assign({}, this.locationForm.value);
    location.locationForm = Object.assign({}, location.locationForm);

    const binRegex = /^\d{6,7}$/;
    const match = binRegex.test(location.searchText);

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
    this.searchLoading = true;
    this.newYorkBridgeService.searchNewYorkBridgesQuery(bridgeQuery)
      .subscribe(data => {
        if (data.count === 0) {
          const query = `bin: "${bridgeQuery.bin}"; ` +
            `carried: "${bridgeQuery.carried}"; ` +
            `county: "${bridgeQuery.county}"; ` +
            `common_name: "${bridgeQuery.commonName}"; `;
          this.notifications.error(
            'Search error',
            `No results found for query: "${query}"`, this.notificationSettings);
        } else {
          if (data.count > 1) {

            this.notifications.info(
              'Returned many records',
              `Displaying 1 of ${data.count} possible results`, this.notificationSettings);
          }
          this.newYorkBridgeService
            .sendBridgeFeature(data.results.features[0]);
        }

      },
      err => this.searchLoading = false,
      () => this.searchLoading = false
    );
  }

  getBinSearch(bin: string): void {
    this.searchLoading = true;
    this.newYorkBridgeService.searchNewYorkBridgesBin(bin)
      .subscribe(
        (data) => this.newYorkBridgeService.sendBridgeFeature(data.results.features[0]),
        err => this.searchLoading = false,
        () => this.searchLoading = false
      );
  }

  getLocationSearch(query: string) {
    this.searchLoading = true;
    this.searchService.locationSearch(query)
      .subscribe(
        (data: Array<NominatimApiResponse>) => {

          if (data.length === 0) {
            this.notifications.error(
              'Search error',
              `No results found for query: "${query}"`, this.notificationSettings);
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
            `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`, this.notificationSettings);
          this.searchLoading = false;
        }, () => this.searchLoading = false
      );
  }

  onHistoryClick() {
    this.sidenavService.close();
  }
}
