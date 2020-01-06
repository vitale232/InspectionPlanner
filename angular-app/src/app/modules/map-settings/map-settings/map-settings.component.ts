import { Component, OnInit, OnDestroy } from '@angular/core';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { LoadingIndicatorService } from 'src/app/shared/services/loading-indicator.service';
import { Title } from '@angular/platform-browser';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { GeolocationStoreService } from 'src/app/shared/stores/geolocation-store.service';
import { Observable, Subscription } from 'rxjs';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { SearchMarker } from 'src/app/shared/models/markers.model';
import { IGeoPosition } from 'src/app/shared/models/geolocation.model';
import { IMapView, TExtent } from 'src/app/shared/models/open-layers-map.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss']
})
export class MapSettingsComponent implements OnInit, OnDestroy {

  mapView: IMapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};

  bridges$: Observable<IBridgeFeature[]>;
  loading$: Observable<boolean>;
  searchMarkers$: Observable<SearchMarker[]>;
  position$: Observable<IGeoPosition>;

  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private bridgesStore: BridgesStoreService,
    private loadingIndicatorService: LoadingIndicatorService,
    private titleService: Title,
    private searchMarkerStore: SearchMarkersStoreService,
    private geolocationStore: GeolocationStoreService,
  ) {
    this.bridges$ = this.bridgesStore.bridges$;
    this.loading$ = this.loadingIndicatorService.loading$;
    this.searchMarkers$ = this.searchMarkerStore.searchMarker$;
    this.position$ = this.geolocationStore.position$;
  }

  ngOnInit() {
    this.subscriptions.add(this.activatedRoute.queryParamMap.subscribe(
      (params) => {
        const lon = parseFloat(params.get('lon'));
        const lat = parseFloat(params.get('lat'));
        const zoom = parseInt(params.get('z'), 10);
        if (lon && lat && zoom) {
          this.mapView =  { zoom, center: [ lon, lat ] };
          this.titleService.setTitle(`IPA - Map Settings @${lon},${lat},${zoom}z`);
        }
      }
    ));
    this.bridges$.subscribe(
      data => console.log('bridge data!', data)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onMapMove(bbox: TExtent) {
    this.bridgesStore.fetchBridges(bbox);
  }

}
