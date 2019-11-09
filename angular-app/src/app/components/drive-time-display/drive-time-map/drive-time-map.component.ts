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


@Component({
  selector: 'app-drive-time-map',
  templateUrl: './drive-time-map.component.html',
  styleUrls: ['./drive-time-map.component.css']
})
export class DriveTimeMapComponent extends BaseMapComponent implements OnInit, OnDestroy {
  placeID: number|null;

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
      loadingIndicatorService
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscriptions.add(this.route.params.subscribe(params => this.placeID = parseInt(params.placeID, 10)));
    console.log(`the placeID is ${this.placeID} of type ${typeof this.placeID}`);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
