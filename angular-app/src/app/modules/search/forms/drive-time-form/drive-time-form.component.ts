import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IDriveTimeQueryFeature, INewDriveTimeParms, ISubmittedDriveTimeQuery } from 'src/app/shared/models/drive-time-queries.model';
import { startWith, map } from 'rxjs/operators';
import { DriveTimeQueriesService } from 'src/app/shared/services/drive-time-queries.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';

@Component({
  selector: 'app-drive-time-form',
  templateUrl: './drive-time-form.component.html',
  styleUrls: ['./drive-time-form.component.scss']
})
export class DriveTimeFormComponent implements OnInit, OnDestroy {

  loading: boolean;

  // Component inputs
  @Input() driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;
  @Input() markerClusterRoutes: boolean;

  // Reactive form setup.
  timeIntervals = [
    {value: 'fifteenMins', viewValue: '15 minutes'},
    {value: 'thirtyMins', viewValue: '30 minutes'},
    {value: 'fortyFiveMins', viewValue: '45 minutes'},
    {value: 'sixtyMins', viewValue: '1 hour'},
    {value: 'seventyFiveMins', viewValue: '1 hour 15 minutes'},
    {value: 'ninetyMins', viewValue: '1 hour 30 minutes'}
  ];
  searchTextControl = new FormControl('', Validators.required);

  driveTimeForm = this.fb.group({
    searchText: this.searchTextControl,
    hours: this.timeIntervals[1].value
  });

  // This form will use material autocomplete:
  // https://material.angular.io/components/autocomplete/overview
  subscriptions = new Subscription();
  filteredOptions$: Observable<IDriveTimeQueryFeature[]>;
  driveTimeQueries: IDriveTimeQueryFeature[];

  constructor(
    private driveTimeQueriesService: DriveTimeQueriesService,
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
    private fb: FormBuilder,
    private notifications: NotificationsService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.subscriptions.add(this.driveTimeQueries$.subscribe(
      data => {
        this.driveTimeQueries = data;
        // Wait until there is data before applying the first filter to the mat-autocomplete
        // If we don't wait until there's data to trigger _filter, there will be an empty list
        // in the autocomplete until the user starts to type
        this.filteredOptions$ = this.searchTextControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      },
      err => console.error('DriveTimeFormComponent.ngOnInit()', err),
    ));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private _filter(value: string): IDriveTimeQueryFeature[] {
    // Compare lowercase input value to the lowercase drive_time_query.properties.display_name that's stripped of commas
    // Return queries that `includes` the input string. The return value is used by mat-autocomplete
    const filterValue = value.toLowerCase();
    return this.driveTimeQueries
      .filter(q => q.properties.drive_time_hours === this.timeIntervalToNumber(this.driveTimeForm.value.hours))
      .filter(query => query.properties.display_name.toLowerCase().replace(/,/g, '').includes(filterValue));
  }

  timeIntervalToNumber(inputDriveTimeHours: string) {
    // Apply to a driveTimeForm.hours dropdown selection to get the numeric representation of the user's selection
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

  onSearch() {
    this.loading = true;

    // Nominatim API doesn't like the display_name sometimes. If the search is cached, use the .search_text
    // otherwise, use the form value
    const selectedQuery = this.driveTimeQueries
      .filter(q => q.properties.display_name === this.driveTimeForm.value.searchText)
      .filter(q => q.properties.drive_time_hours === this.timeIntervalToNumber( this.driveTimeForm.value.hours ));

    console.log('selectedQuery', selectedQuery);
    let querySearchText;
    if (selectedQuery.length === 1) {
      querySearchText = selectedQuery[0].properties.search_text;
      // If the selected query is of length 1, let's just navigate to the dtq
      this.onExistingDriveTimeQuery(selectedQuery[0], selectedQuery[0].properties.drive_time_hours.toString());
      return null;
    } else {
      querySearchText = this.driveTimeForm.value.searchText;
    }
    console.log('querySearchText', querySearchText);

    const driveTimeQueryParams: INewDriveTimeParms = {
      q: querySearchText,
      drive_time_hours: this.timeIntervalToNumber( this.driveTimeForm.value.hours).toString(),
      return_bridges: false
    };
    this.driveTimeQueriesService.getDriveTime(driveTimeQueryParams).subscribe(
      data => {
        if ((data as IDriveTimeQueryFeature).id) {
          console.log('existing drive time', data);
          this.onExistingDriveTimeQuery((data as IDriveTimeQueryFeature), driveTimeQueryParams.drive_time_hours);
        } else if ((data as ISubmittedDriveTimeQuery).msg === 'The request has been added to the queue') {
          console.log('new drive time', data);
          this.onNewDriveTimeQuery(driveTimeQueryParams);
        }
      },
      err => {
        console.error(err);
        if (err.status === 400) {
          this.notifications.error(
            'Search error',
            'The search location is not within the extent of the routable network. ' +
            'Search for a place that lies within the blue box on the map.'
            );
          } else if (err.status === 404) {
            this.notifications.error(
              'Search error',
              `No results found for query: ${this.driveTimeForm.value.searchText}`
              );
          } else {
            this.notifications.error(
              'Unhandled error',
              `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
              );
          }
        this.loading = false;
      }
    );
  }

  onExistingDriveTimeQuery(driveTimeQuery: IDriveTimeQueryFeature, driveTimeHours: string): void {
    let zoom = 18;
    const hours = parseFloat(driveTimeHours);
    if (hours <= 1.0) {
      zoom = 8;
    } else if (hours > 1.0) {
      zoom = 7;
    }
    console.log('driveTimeQuery', driveTimeQuery);
    const routerQueryParams = {
      lon: driveTimeQuery.geometry.coordinates[0].toFixed(4),
      lat: driveTimeQuery.geometry.coordinates[1].toFixed(4),
      z: zoom
    };

    this.loading = false;

    // Use different routes if this component has the markerClusterRoutes flag
    if (this.markerClusterRoutes) {
      this.router.navigate([`marker-cluster/drive-time/${driveTimeQuery.id}`]);
    } else {
      this.router.navigate([`drive-time/${driveTimeQuery.id}`], { queryParams: routerQueryParams });
    }
  }

  onNewDriveTimeQuery(driveTimeQueryParams: INewDriveTimeParms): void {
    // setTimeout( () => this.sidenav.close(), 500 );
    this.notifications.info(
      'Hold Up!',
      `This is a new drive time request, which takes a while to process. ` +
      `Check the "Search History" for your results in a bit. Note: ` +
      `The longer the drive time, the longer the wait!`
    );
    this.loading = false;
    this.driveTimeQueriesService.pollDriveTimeQuery(driveTimeQueryParams).subscribe(
      data => console.log('poll data!', data),
      err => {
        this.notifications.error(
          'Unhandled Error!',
          `ERROR: "${err.error}"\nMESSAGE: "${err.message}"`
        );
        this.loading = false;
        console.error('pollDriveTimeQuery error', err);
      },
      () => {
        console.log('Polling complete!');
        // Update the drive time query store when the new dtq is completed
        this.driveTimeQueriesStore.fetchDriveTimeQueries();
      }
    );
  }

  onClear(): void {
    this.searchTextControl.setValue('');
  }

}
