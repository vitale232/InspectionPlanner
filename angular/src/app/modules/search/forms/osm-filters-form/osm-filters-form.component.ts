import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-osm-filters-form',
  templateUrl: './osm-filters-form.component.html',
  styleUrls: ['./osm-filters-form.component.scss']
})
export class OsmFiltersFormComponent implements OnInit {

  osmFilterForm = this.fb.group({
    streetAddress: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl('NY'),
    country: new FormControl('USA')
  });

  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
  }

}
