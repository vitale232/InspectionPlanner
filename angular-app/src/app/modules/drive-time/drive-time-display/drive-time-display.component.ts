import { Component, OnInit, ViewChild } from '@angular/core';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { Observable, Subscription } from 'rxjs';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { SearchMarker } from 'src/app/shared/models/markers.model';
import { LoadingIndicatorService } from 'src/app/shared/services/loading-indicator.service';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { OpenLayersMapComponent } from 'src/app/shared/components/open-layers-map/open-layers-map.component';
import { IMapView } from 'src/app/shared/models/open-layers-map.model';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
import { IDriveTimeQueryFeature } from 'src/app/shared/models/drive-time-queries.model';
import { DriveTimeQueriesStoreService } from 'src/app/shared/stores/drive-time-queries-store.service';

@Component({
  selector: 'app-drive-time-display',
  templateUrl: './drive-time-display.component.html',
  styleUrls: ['./drive-time-display.component.scss']
})
export class DriveTimeDisplayComponent implements OnInit {

  @ViewChild(OpenLayersMapComponent, { static: false }) private openLayersMapComponent: OpenLayersMapComponent;

  driveTimeID: number;
  mapView: IMapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};

  loading$: Observable<boolean>;
  driveTimeBridges$: Observable<IBridgeFeature[]>;
  searchMarkers$: Observable<SearchMarker[]>;
  selectedDriveTimeQuery$: Observable<IDriveTimeQueryFeature>;

  subscriptions = new Subscription();

  splitterOrientation: 'horizontal' | 'vertical' = 'horizontal';
  mapSize = 50;
  tableSize = 50;
  minTableSize = 5;

  constructor(
    private activatedRoute: ActivatedRoute,
    private bridgesStore: BridgesStoreService,
    private loadingIndicatorService: LoadingIndicatorService,
    private router: Router,
    private searchMarkerStore: SearchMarkersStoreService,
    private titleService: Title,
    private navbarService: NavbarService,
    private sidenavService: SidenavService,
    private driveTimeQueriesStore: DriveTimeQueriesStoreService,
  ) {
    this.driveTimeBridges$ = this.bridgesStore.driveTimeBridges$;
    this.loading$ = this.loadingIndicatorService.loading$;
    this.searchMarkers$ = this.searchMarkerStore.searchMarker$;
    this.selectedDriveTimeQuery$ = this.driveTimeQueriesStore.selectedDriveTimeQuery$;
  }

  ngOnInit() {
    this.getSplitterOrientation();
    this.tableSize = 50;
    this.mapSize = 50;
    this.navbarService.tableOpen = true;

    this.subscriptions.add(this.activatedRoute.params.subscribe(
      params => {
        this.driveTimeID = parseInt(params.driveTimeID, 10);

        this.titleService.setTitle(`IPA - Drive Time ${this.driveTimeID}`);
        this.checkAndFetchDriveTime();
        console.log('params data', params);
        this.bridgesStore.driveTimeID = this.driveTimeID;
      },
      err => console.error(err),
      () => console.log('activatedRouter sub complete!')
    ));

    this.subscriptions.add(this.activatedRoute.queryParamMap.subscribe(
      (params) => {
        const lon = parseFloat(params.get('lon'));
        const lat = parseFloat(params.get('lat'));
        const zoom = parseInt(params.get('z'), 10);

        if (lon && lat && zoom) {
          this.mapView =  { zoom, center: [ lon, lat ] };
          this.titleService.setTitle(`IPA - Drive Time ${this.driveTimeID} @${lon},${lat},${zoom}z`);

        } else {
          // this.mapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};
          console.log('DRIVE TIME PARAMS ELSE!');
        }
        console.log('init mapView', this.mapView);
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

    this.subscriptions.add(this.selectedDriveTimeQuery$.subscribe(
      data => console.log('selected from dtd comp', data),
      err => console.error('from drive-time-display', err),
      () => console.log('selectedDriveTimeQuery$ complete.')
    ));

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

  updateMapSize() {
    if (this.openLayersMapComponent && this.openLayersMapComponent.map) {
      console.log('updateMapSize start', this.mapView);
      this.openLayersMapComponent.updateUrl();
      setTimeout(() => this.openLayersMapComponent.map.updateSize(), 200);
      setTimeout(() => console.log('updateMapSize end', this.mapView), 200);

    }
  }

  onMapMove(event) {
    console.log('dt onMapMove event', event);
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
