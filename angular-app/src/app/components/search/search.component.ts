import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { Subscription, Observable } from 'rxjs';
import {
  IDriveTimeQueryFeature,
  ISubmittedDriveTimeQuery,
  DriveTimeEndpoint,
  IDriveTimeQueryApiResponse,
  IQueryProperties} from 'src/app/models/drive-time-queries.model';
import { startWith, map } from 'rxjs/operators';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Output() Focus = new EventEmitter<boolean>();
  @Output() Blur = new EventEmitter<boolean>();
  detailsPanelOpen = false;
  pastPanelOpen = false;
  driveTimeSearchToggle = false;
  bridgeSearchToggle = false;
  searchLoading = false;
  selectedTimeInterval = 'fifteenMins';
  locationSearch: LocationSearchResult|null = null;
  subscriptions = new Subscription();
  recentQueries: IQueryProperties[] = [];
  filteredRecentQueries: Observable<IQueryProperties[]>;
  placeNames: string[] = [];
  filteredPlaceNames: Observable<string[]>;
  notificationSettings = {
    timeOut: 20000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  };

  locationForm = this.fb.group({
    searchText: new FormControl('', Validators.required)
  });

  timeIntervals = [
    {value: 'fifteenMins', viewValue: '15 minutes'},
    {value: 'thirtyMins', viewValue: '30 minutes'},
    {value: 'fortyFiveMins', viewValue: '45 minutes'},
    {value: 'sixtyMins', viewValue: '1 hour'},
    {value: 'seventyFiveMins', viewValue: '1 hour 15 minutes'},
    {value: 'ninetyMins', viewValue: '1 hour 30 minutes'}
  ];

  driveTimeSearchTextControl = new FormControl('', Validators.required);
  driveTimeForm = this.fb.group({
    searchText: this.driveTimeSearchTextControl,
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

  ngOnInit() {
    this.subscriptions.add(this.driveTimeForm.valueChanges.subscribe(
      (data) => this._filter(this.driveTimeForm.value.searchText))
    );
    this.getRecentQueries();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  sendFocus() {
    this.filterQueries();

    const allowSidenavEscape = false;
    this.Focus.emit(allowSidenavEscape);
  }

  sendBlur() {
    const allowSidenavEscape = true;
    this.Blur.emit(allowSidenavEscape);
  }

  filterQueries() {
    this.filteredRecentQueries = this.driveTimeSearchTextControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(searchText: string) {
    function sortByDisplayName(a: IQueryProperties, b: IQueryProperties) {
      const aText = a.display_name.toLowerCase().replace(',', '');
      const bText = b.display_name.toLowerCase().replace(',', '');
      if (aText < bText) {
        return -1;
      } else if (aText > bText) {
        return 1;
      } else {
        return 0;
      }
    }
    const filterText = searchText.toLowerCase().replace(',', '');
    return this.recentQueries
      .filter(q => q.drive_time_hours === this.formHoursToNumber(this.driveTimeForm.value.driveTimeHours))
      .filter(q => q.display_name.toLowerCase().replace(',', '').includes(filterText))
      .sort(sortByDisplayName);
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
          this.recentQueries = queryProperties;
          this.filterQueries();
        },
        (err) => console.error(err),
        () => 'complete!'
      );
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

  formHoursToNumber(inputDriveTimeHours: string) {
    let outputDriveTimeHours = 0.5;
    switch (inputDriveTimeHours) {
      case 'fifteenMins':
        outputDriveTimeHours = 0.25;
        break;
      case 'thirtyMins':
        outputDriveTimeHours = 0.50;
        break;
      case 'fortyFiveMins':
        outputDriveTimeHours = 0.75;
        break;
      case 'sixtyMins':
        outputDriveTimeHours = 1.00;
        break;
      case 'seventyFiveMins':
        outputDriveTimeHours = 1.25;
        break;
      case 'ninetyMins':
        outputDriveTimeHours = 1.50;
        break;
    }
    return outputDriveTimeHours;
  }

  onDriveTimeQuery(): void {
    this.searchLoading = true;
    const driveTimeHours = this.formHoursToNumber(this.driveTimeForm.value.driveTimeHours).toString();

    // Nominatim API doesn't like the display_name sometimes. If the search is cached, use the .search_text
    // otherwise, use the form value
    const selectedQuery = this.recentQueries
      .filter(q => q.display_name === this.driveTimeForm.value.searchText)
      .filter(q => q.drive_time_hours === this.formHoursToNumber(this.driveTimeForm.value.driveTimeHours));

    let querySearchText = '';
    if (selectedQuery.length === 1) {
      querySearchText = selectedQuery[0].search_text;
    } else {
      querySearchText = this.driveTimeForm.value.searchText;
    }
    const requestQueryParams = {
      q: querySearchText,
      drive_time_hours: driveTimeHours,
      return_bridges: false
    };
    this.searchService.getNewDriveTimeQuery(requestQueryParams).subscribe((data: DriveTimeEndpoint) => {
      if ((data as IDriveTimeQueryFeature).id) {
        this.handleExistingDriveTimeQuery((data as IDriveTimeQueryFeature), driveTimeHours);
      } else if ((data as ISubmittedDriveTimeQuery).msg === 'The request has been added to the queue') {
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
        } else if (err.status === 404) {
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

  handleExistingDriveTimeQuery(data: IDriveTimeQueryFeature, inputDriveTimeHours: string) {
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
      if (location.searchText.includes('New York State Department of Transportation')) {
        location.searchText = '50 wolf road, albany, ny';
      }
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
