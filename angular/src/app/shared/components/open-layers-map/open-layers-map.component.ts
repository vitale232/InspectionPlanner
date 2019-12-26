import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';


@Component({
  selector: 'app-open-layers-map',
  templateUrl: './open-layers-map.component.html',
  styleUrls: ['./open-layers-map.component.scss']
})
export class OpenLayersMapComponent implements OnInit {

  constructor() { console.log(new Map()); }

  ngOnInit() {
  }

}
