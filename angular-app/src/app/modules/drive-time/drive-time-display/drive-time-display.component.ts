import { Component, OnInit, ViewChild } from '@angular/core';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { Observable, Subscription } from 'rxjs';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { SearchMarker } from 'src/app/shared/models/markers.model';
import { LoadingIndicatorService } from 'src/app/shared/services/loading-indicator.service';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { OpenLayersMapComponent } from 'src/app/shared/components/open-layers-map/open-layers-map.component';
import { IMapView } from 'src/app/shared/models/open-layers-map.model';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';
import { DriveTimePolygonStoreService } from 'src/app/shared/stores/drive-time-polygon-store.service';
import { IDriveTimePolygonFeature } from 'src/app/shared/models/drive-time-polygons.model';
import { IGeoPosition } from 'src/app/shared/models/geolocation.model';
import { GeolocationStoreService } from 'src/app/shared/stores/geolocation-store.service';
import { ColormapStoreService } from 'src/app/shared/stores/colormap-store.service';
import { IColormap, IDistinctColormap } from 'src/app/shared/models/map-settings.model';
import { MapViewStoreService } from 'src/app/shared/stores/map-view-store.service';

@Component({
  selector: 'app-drive-time-display',
  templateUrl: './drive-time-display.component.html',
  styleUrls: ['./drive-time-display.component.scss']
})
export class DriveTimeDisplayComponent implements OnInit {

  @ViewChild(OpenLayersMapComponent, { static: false }) private openLayersMapComponent: OpenLayersMapComponent;

  driveTimeID: number;

  mapView$: Observable<IMapView>;
  loading$: Observable<boolean>;
  driveTimeBridges$: Observable<IBridgeFeature[]>;
  searchMarkers$: Observable<SearchMarker[]>;
  selectedDriveTimeQuery$: Observable<IDriveTimeQueryFeature>;
  driveTimePolygon$: Observable<IDriveTimePolygonFeature>;
  position$: Observable<IGeoPosition>;
  colormap$: Observable<IColormap|IDistinctColormap>;

  subscriptions = new Subscription();

  splitterOrientation: 'horizontal' | 'vertical' = 'horizontal';
  mapSize = 50;
  tableSize = 50;
  minTableSize = 5;

  noNavigate = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bridgesStore: BridgesStoreService,
    private loadingIndicatorService: LoadingIndicatorService,
    private searchMarkerStore: SearchMarkersStoreService,
    private titleService: Title,
    private navbarService: NavbarService,
    private sidenavService: SidenavService,
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
    private driveTimePolygonStore: DriveTimePolygonStoreService,
    private geolocationStore: GeolocationStoreService,
    private colormapStore: ColormapStoreService,
    private mapViewStore: MapViewStoreService,
  ) {
    this.mapView$ = this.mapViewStore.mapView$;
    this.driveTimeBridges$ = this.bridgesStore.driveTimeBridges$;
    this.loading$ = this.loadingIndicatorService.loading$;
    this.searchMarkers$ = this.searchMarkerStore.searchMarker$;
    this.selectedDriveTimeQuery$ = this.driveTimeQueriesStore.selectedDriveTimeQuery$;
    this.driveTimePolygon$ = this.driveTimePolygonStore.driveTimePolygon$;
    this.position$ = this.geolocationStore.position$;
    this.colormap$ = this.colormapStore.colormap$;
  }

  ngOnInit() {
    this.getSplitterOrientation();

    if (this.navbarService.tableOpen) {
      this.mapSize = 50;
      this.tableSize = 50;
    } else {
      this.mapSize = 100;
      this.tableSize = 0;
    }

    this.subscriptions.add(this.activatedRoute.params.subscribe(
      params => {
        this.driveTimeID = parseInt(params.driveTimeID, 10);

        this.titleService.setTitle(`IPA - Drive Time ${this.driveTimeID}`);
        this.checkAndFetchDriveTime();
      },
      err => console.error(err),
    ));

    this.subscriptions.add(this.activatedRoute.queryParamMap.subscribe(
      (params) => {
        const lon = parseFloat(params.get('lon'));
        const lat = parseFloat(params.get('lat'));
        const zoom = parseInt(params.get('z'), 10);

        if (lon && lat && zoom) {
          if (!this.noNavigate) {
            this.mapViewStore.mapView =  { zoom, center: [ lon, lat ] };
            this.titleService.setTitle(`IPA - Browse Bridges @${lon},${lat},${zoom}z`);
          }
        } else {
          console.log('DRIVE TIME PARAMS ELSE!');
        }
      }
    ));

    this.subscriptions.add(this.navbarService.tableOpen$.subscribe(
      (tableOpen: boolean) => {
        if (tableOpen) { this.openTable(); } else { this.closeTable(); }
      }
    ));

    this.subscriptions.add(this.sidenavService.sidenavState$.subscribe(
      () => this.suspendNavigation(),
      err => console.error(err),
    ));
  }

  suspendNavigation() {
    this.noNavigate = true;
    setTimeout(() => this.noNavigate = false, 500);
    this.updateMapSize();
  }

  closeTable() {
    this.mapSize = 100;
    this.tableSize = 0;
    this.suspendNavigation();
  }

  openTable() {
    if (this.tableSize > this.minTableSize) {
      return;
    } else {
      this.mapSize = 50;
      this.tableSize = 50;
    }
    this.suspendNavigation();
  }

  splitDragEnd(event: { gutterNum: number, sizes: number[] }) {
    this.mapSize = event.sizes[0];
    this.tableSize = event.sizes[1];
    if (this.tableSize <= this.minTableSize) {
      this.navbarService.tableOpen = false;
    } else {
      this.navbarService.tableOpen = true;
    }
    this.suspendNavigation();
  }

  onResize(event: Event) {
    this.getSplitterOrientation();
    this.updateMapSize();
  }

  updateMapSize() {
    if (this.openLayersMapComponent && this.openLayersMapComponent.map) {
      setTimeout(() => this.openLayersMapComponent.map.updateSize(), 200);
    }
  }

  onMapMove(event) {
  }

  checkAndFetchDriveTime() {
    if (this.bridgesStore.driveTimeID !== this.driveTimeID) {
      this.bridgesStore.fetchDriveTimeBridges(this.driveTimeID);
    }
  }

  getSplitterOrientation() {
    if (window.innerWidth <= 599) {
      this.splitterOrientation = 'vertical';
    } else {
      this.splitterOrientation = 'horizontal';
    }
  }


}
