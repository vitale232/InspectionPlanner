import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-drive-time-form',
  templateUrl: './drive-time-form.component.html',
  styleUrls: ['./drive-time-form.component.scss']
})
export class DriveTimeFormComponent implements OnInit, OnDestroy {

  // Component inputs
  @Input() driveTimeQueries$: Observable<IDriveTimeQueryFeature[]>;

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
  filteredOptions: Observable<IDriveTimeQueryFeature[]>;
  driveTimeQueries: IDriveTimeQueryFeature[];

  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
    this.subscriptions.add(this.driveTimeQueries$.subscribe(
      data => {
        this.driveTimeQueries = data;
        // Wait until there is data before applying the first filter to the mat-autocomplete
        this.filteredOptions = this.searchTextControl.valueChanges.pipe(
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

}
