import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  title = 'angular-app';
  options = {
    layers: [
      tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '<a href="https://openstreetmap.org">OpenStreetMap</a>'
        }
      )
    ],
    zoom: 5,
    center: latLng(46.879966, -70.726909)
  };
  constructor() { }

  ngOnInit() {
  }

}
