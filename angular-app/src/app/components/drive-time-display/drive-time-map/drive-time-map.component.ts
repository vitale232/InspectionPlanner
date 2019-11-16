import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { SearchService } from 'src/app/services/search.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
import { ClientLocationService } from 'src/app/services/client-location.service';
import { MapToolsService } from 'src/app/services/map-tools.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { BaseMapComponent } from '../../base-map/base-map.component';

import * as driveTimeMapConfig from './drive-time-map-config';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-drive-time-map',
  templateUrl: './drive-time-map.component.html',
  styleUrls: ['./drive-time-map.component.css']
})
export class DriveTimeMapComponent extends BaseMapComponent implements OnInit, OnDestroy {
  driveTimeID: number|null;
  splitterOrientation = 'horizontal';
  bridgeMarker = driveTimeMapConfig.bridgeMarker;
  maxVisibleZoom = 6;
  zoomInMessage = 'Zoom in to view drive-time bridges!';

  constructor(
    public newYorkBridgeService: NewYorkBridgeService,
    public searchService: SearchService,
    public snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public router: Router,
    public location: Location,
    public changeDetector: ChangeDetectorRef,
    public notifications: NotificationsService,
    public clientLocationService: ClientLocationService,
    public mapToolsService: MapToolsService,
    public sidenavService: SidenavService,
    public loadingIndicatorService: LoadingIndicatorService,
    public activatedRoute: ActivatedRoute,
    public titleService: Title
  ) {
    super(
      newYorkBridgeService,
      searchService,
      snackBar,
      route,
      router,
      location,
      changeDetector,
      notifications,
      clientLocationService,
      mapToolsService,
      sidenavService,
      loadingIndicatorService,
      activatedRoute,
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(this.route.params.subscribe(params => {
      this.driveTimeID = parseInt(params.driveTimeID, 10);
      this.newYorkBridgesUri = `bridges/new-york-bridges/drive-time-query/${this.driveTimeID}/`;
      this.newYorkBridgesLuckyUri = `bridges/new-york-bridges/drive-time-query/${this.driveTimeID}/`;
      this.titleService.setTitle(`IPA - Drive Time Query ${this.driveTimeID}`);
    }));
    console.log(`the driveTimeID is ${this.driveTimeID} of type ${typeof this.driveTimeID}`);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onMapMove(mapMoveEvent: Event) {
    const page = 1;
    let zoom = null;
    if (this.map) {
      zoom = this.map.getZoom();
    }
    let bridgeBoundsContained = false;
    let mapBoundsContained = null;
    let padding = this.padding;

    if (this.model.overlayLayers && this.map && this.bridgeBounds) {
      bridgeBoundsContained = this.map.getBounds().contains(this.bridgeBounds);
    }
    // When zoomed in, check if the map bounds lies within the
    // bridges bounds (bounding box, bbox). If so, don't load data.
    // If not, load data based on zoom
    if (this.model.overlayLayers && zoom) {
      if (zoom > 12) {
        // Add a little extra padding when its likely the entire
        // first page of bridges are within the map extent
        padding = this.padding + 0.25;
      }
      if (this.bridgeBounds) {
        mapBoundsContained = this.bridgeBounds
          .pad(padding)
          .contains(this.map.getBounds());
      }
    } else {
      mapBoundsContained = false;
      this.loadingIndicatorService.sendLoadingIndicatorState(true);
    }

    if (!mapBoundsContained && !bridgeBoundsContained) {
      if (zoom && zoom >= this.maxVisibleZoom) {
        this.getBridgesBbox(page, this.map.getBounds().pad(padding));
      } else {
        this.getRandomBridges(false);
      }
    }
    this.updateUrl(zoom);
  }
}
