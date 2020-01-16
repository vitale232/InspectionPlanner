import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { Subscription, Observable } from 'rxjs';
import { IMapView, IMarker, TExtent } from 'src/app/shared/models/open-layers-map.model';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { LoadingIndicatorService } from 'src/app/shared/services/loading-indicator.service';
import { OpenLayersMapComponent } from 'src/app/shared/components/open-layers-map/open-layers-map.component';
import { Title } from '@angular/platform-browser';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { ActivatedRoute } from '@angular/router';
import { SearchMarker } from 'src/app/shared/models/markers.model';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { IGeoPosition } from 'src/app/shared/models/geolocation.model';
import { GeolocationStoreService } from 'src/app/shared/stores/geolocation-store.service';
import { ColormapStoreService } from 'src/app/shared/stores/colormap-store.service';
import { IColormap, IDistinctColormap } from 'src/app/shared/models/map-settings.model';


@Component({
  selector: 'app-browse-bridges-display',
  templateUrl: './browse-bridges-display.component.html',
  styleUrls: ['./browse-bridges-display.component.scss']
})
export class BrowseBridgesDisplayComponent implements OnInit, OnDestroy {

  @ViewChild(OpenLayersMapComponent, { static: false }) private openLayersMapComponent: OpenLayersMapComponent;

  mapView: IMapView = { zoom: 10, center: [ -73.8727, 42.6532 ]};

  loading$: Observable<boolean>;
  bridges$: Observable<IBridgeFeature[]>;
  searchMarkers$: Observable<SearchMarker[]>;
  position$: Observable<IGeoPosition>;
  colormap$: Observable<IColormap|IDistinctColormap>;

  subscriptions = new Subscription();

  splitterOrientation: 'horizontal' | 'vertical' = 'horizontal';
  mapSize = 50;
  tableSize = 50;
  minTableSize = 5;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navbarService: NavbarService,
    private bridgesStore: BridgesStoreService,
    private loadingIndicatorService: LoadingIndicatorService,
    private titleService: Title,
    private sidenavService: SidenavService,
    private searchMarkerStore: SearchMarkersStoreService,
    private geolocationStore: GeolocationStoreService,
    private colormapStore: ColormapStoreService,
  ) {
    this.bridges$ = this.bridgesStore.bridges$;
    this.loading$ = this.loadingIndicatorService.loading$;
    this.searchMarkers$ = this.searchMarkerStore.searchMarker$;
    this.position$ = this.geolocationStore.position$;
    this.colormap$ = this.colormapStore.colormap$;

    this.titleService.setTitle('IPA - Browse Bridges');
  }

  ngOnInit() {
    this.getSplitterOrientation();

    if (this.navbarService.tableOpen) {
      this.tableSize = 50;
      this.mapSize = 50;
    } else {
      this.tableSize = 0;
      this.mapSize = 100;
    }

    this.subscriptions.add(this.activatedRoute.queryParamMap.subscribe(
      (params) => {
        const lon = parseFloat(params.get('lon'));
        const lat = parseFloat(params.get('lat'));
        const zoom = parseInt(params.get('z'), 10);
        if (lon && lat && zoom) {
          this.mapView =  { zoom, center: [ lon, lat ] };
          this.titleService.setTitle(`IPA - Browse Bridges @${lon},${lat},${zoom}z`);
        } else {
          // this.mapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};
          console.log('BROWSE BRIDGES PARAMS ELSE!!!!');
        }
      }
    ));

    this.subscriptions.add(this.navbarService.tableOpen$.subscribe(
      (tableOpen: boolean) => {
        if (tableOpen) { this.openTable(); } else { this.closeTable(); }
      }
    ));

    this.subscriptions.add(this.sidenavService.sidenavState$.subscribe(
      () => this.updateMapSize(),
      err => console.error(err),
      () => this.updateMapSize()
    ));

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  closeTable() {
    this.mapSize = 100;
    this.tableSize = 0;
    this.updateMapSize();
  }

  openTable() {
    if (this.tableSize > this.minTableSize) {
      return;
    } else {
      this.mapSize = 50;
      this.tableSize = 50;
    }
    this.updateMapSize();
  }

  getSplitterOrientation() {
    if (window.innerWidth <= 599) {
      this.splitterOrientation = 'vertical';
    } else {
      this.splitterOrientation = 'horizontal';
    }
  }

  splitDragEnd(event: { gutterNum: number, sizes: number[] }) {
    console.log('drag');
    this.mapSize = event.sizes[0];
    this.tableSize = event.sizes[1];
    if (this.tableSize <= this.minTableSize) {
      this.navbarService.tableOpen = false;
    } else {
      this.navbarService.tableOpen = true;
    }
    this.updateMapSize();
  }

  onResize(event: Event) {
    this.getSplitterOrientation();
    this.updateMapSize();
  }

  onMapMove(bbox: TExtent) {
    this.bridgesStore.fetchBridges(bbox);
  }

  updateMapSize() {
    if (this.openLayersMapComponent && this.openLayersMapComponent.map) {
      // console.log('updateMapSize start', this.mapView);
      this.openLayersMapComponent.map.getView().setCenter(
        this.openLayersMapComponent.map.getView().getCenter()
      );
      // this.openLayersMapComponent.map.setZoom

      this.openLayersMapComponent.updateUrl();
      setTimeout(() => this.openLayersMapComponent.map.updateSize(), 200);
      // setTimeout(() => console.log('updateMapSize end', this.mapView), 200);

    }
  }

}
