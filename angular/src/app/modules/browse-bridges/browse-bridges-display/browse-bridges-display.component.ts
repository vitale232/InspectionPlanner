import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { NavbarService } from 'src/app/shared/services/navbar.service';
import { Subscription, Observable } from 'rxjs';
import { IMapView, IMarker, TExtent } from 'src/app/shared/models/open-layers-map.model';
import { BridgeFeature } from 'src/app/shared/models/bridges.model';
import { BridgesStoreService } from 'src/app/shared/store/bridges-store.service';
import { LoadingIndicatorService } from 'src/app/shared/services/loading-indicator.service';
import { OpenLayersMapComponent } from 'src/app/shared/components/open-layers-map/open-layers-map.component';
import { Title } from '@angular/platform-browser';
import { SidenavService } from 'src/app/shared/services/sidenav.service';

@Component({
  selector: 'app-browse-bridges-display',
  templateUrl: './browse-bridges-display.component.html',
  styleUrls: ['./browse-bridges-display.component.scss']
})
export class BrowseBridgesDisplayComponent implements OnInit, OnDestroy {

  @ViewChild(OpenLayersMapComponent, { static: false }) private openLayersMapComponent: OpenLayersMapComponent;

  mapView: IMapView = { zoom: 11, center: [ -76.1322, 43.0985 ]};
  markerInputs: IMarker[];

  loading$: Observable<boolean>;
  bridges$: Observable<BridgeFeature[]>;

  subscriptions = new Subscription();

  splitterOrientation: 'horizontal' | 'vertical' = 'horizontal';
  mapSize = 50;
  tableSize = 50;

  constructor(
    private navbarService: NavbarService,
    private bridgesStore: BridgesStoreService,
    private loadingIndicatorService: LoadingIndicatorService,
    private titleService: Title,
    private sidenavService: SidenavService,
  ) {
    this.bridges$ = this.bridgesStore.bridges$;
    this.loading$ = this.loadingIndicatorService.loading$;

    this.titleService.setTitle('IPA - Browse Bridges');

    this.subscriptions.add(this.navbarService.tableOpen$.subscribe(
      (tableOpen: boolean) => {
        if (tableOpen) { this.openTable(); } else { this.closeTable(); }
      }
    ));

    this.subscriptions.add(this.bridges$.subscribe(data => console.log('bridges', data)));
    this.subscriptions.add(this.sidenavService.sidenavState$.subscribe(
      data => this.updateMapSize(),
      err => console.error(err),
      () => this.updateMapSize()
    ));
  }

  ngOnInit() {
    this.getSplitterOrientation();
    this.tableSize = 50;
    this.mapSize = 50;
    this.navbarService.tableOpen = true;
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
    if (this.tableSize > 1) {
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
    if (this.tableSize <= 1) {
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
      setTimeout(() => this.openLayersMapComponent.map.updateSize(), 50);
    }
  }

}
