import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMapView } from 'src/app/models/open-layers-map.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MapToolsService } from 'src/app/services/map-tools.service';
import { MapExtent } from 'src/app/models/map-tools.model';
import { ClientLocationService } from 'src/app/services/client-location.service';
import { ClientLocation, LocationSearchResult } from 'src/app/models/location-search.model';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-browse-display',
  templateUrl: './browse-display.component.html',
  styleUrls: ['./browse-display.component.css']
})
export class BrowseDisplayComponent implements OnInit, OnDestroy {

  mapView: IMapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};

  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private mapToolsService: MapToolsService,
    private clientLocationService: ClientLocationService,
    private searchService: SearchService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.activatedRoute.queryParamMap.subscribe(
      (data) => {
        const lon = parseFloat(data.get('lon'));
        const lat = parseFloat(data.get('lat'));
        const zoom = parseInt(data.get('z'), 10);
        this.mapView =  { zoom, center: [ lon, lat ] };
      }
    ));
    this.subscriptions.add(this.mapToolsService.getMapHome$().subscribe(
      (home: MapExtent) => this.mapView = { zoom: home.z, center: [ home.lon, home.lat ]}
    ));
    this.subscriptions.add(this.clientLocationService.getClientLocation$().subscribe(
      (geoloc: ClientLocation) => {
        this.mapView = { zoom: 14, center: [ geoloc.lon, geoloc.lat ] };
      }
    ));
    this.subscriptions.add(this.searchService.getLocationSearchResult$().subscribe(
      (searchResult: LocationSearchResult) => {
        console.log('searchResult', searchResult);
        this.mapView = {zoom: searchResult.z, center: [ parseFloat(searchResult.lon), parseFloat(searchResult.lat) ] };
      }
    ));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
