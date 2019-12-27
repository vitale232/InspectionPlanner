import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-omni-search-form',
  templateUrl: './omni-search-form.component.html',
  styleUrls: ['./omni-search-form.component.scss']
})
export class OmniSearchFormComponent implements OnInit {

  omniSearchForm = this.fb.group({
    searchText: new FormControl('', Validators.required)
  });

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

}
