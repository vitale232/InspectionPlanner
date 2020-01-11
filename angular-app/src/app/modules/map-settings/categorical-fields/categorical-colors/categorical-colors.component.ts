import { Component, OnInit } from '@angular/core';
import { ISelectOption } from 'src/app/shared/models/bridges.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-categorical-colors',
  templateUrl: './categorical-colors.component.html',
  styleUrls: ['./categorical-colors.component.scss']
})
export class CategoricalColorsComponent implements OnInit {

  fieldOptions: ISelectOption[] = [
    { value: 'region', viewOption: 'NYSDOT Region' },
    { value: 'political_field', viewOption: 'Municipality' },
    { value: 'primary_owner', viewOption: 'Primary Owner' },
    { value: 'primary_maintainer', viewOption: 'Primary Maintainer' },
    { value: 'gtms_mater', viewOption: 'Material Type' },
    { value: 'gtms_structure', viewOption: 'Structure Type' },
    { value: 'posted_leg', viewOption: 'Posted Leg' },
    { value: 'state_owned', viewOption: 'State Owned' },
  ].sort((a, b) => a.viewOption > b.viewOption ? 1 : -1);

  fieldControl = this.fb.control('', Validators.required);
  constructor( private fb: FormBuilder ) { }

  ngOnInit() {
  }

}
