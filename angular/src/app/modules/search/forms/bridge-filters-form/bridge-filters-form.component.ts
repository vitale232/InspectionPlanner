import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-bridge-filters-form',
  templateUrl: './bridge-filters-form.component.html',
  styleUrls: ['./bridge-filters-form.component.scss']
})
export class BridgeFiltersFormComponent implements OnInit {

  bridgeForm = this.fb.group({
    bin: [''],
    carried: [''],
    county: [''],
    commonName: [''],
  });

  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
  }

}
