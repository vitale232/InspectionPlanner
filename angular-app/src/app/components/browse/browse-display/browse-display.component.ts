import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMapView } from 'src/app/models/open-layers-map.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browse-display',
  templateUrl: './browse-display.component.html',
  styleUrls: ['./browse-display.component.css']
})
export class BrowseDisplayComponent implements OnInit, OnDestroy {

  initialMapView: IMapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};

  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.activatedRoute.queryParamMap.subscribe(
      (data) => {
        const lon = parseFloat(data.get('lon'));
        const lat = parseFloat(data.get('lat'));
        const zoom = parseInt(data.get('z'), 10);
        this.initialMapView =  { zoom, center: [ lon, lat ] };
      }
    ));
  }

  ngOnDestroy() {}

}
