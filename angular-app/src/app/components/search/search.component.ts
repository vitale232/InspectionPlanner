import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  panelOpen = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}
