import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseMapComponent } from '../base-map/base-map.component';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ClientLocationService } from 'src/app/services/client-location.service';
import { MapToolsService } from 'src/app/services/map-tools.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { SearchService } from 'src/app/services/search.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent extends BaseMapComponent implements OnInit, OnDestroy {

  constructor(
    public newYorkBridgeService: NewYorkBridgeService,
    public searchService: SearchService,
    public snackBar: MatSnackBar,
    public route: ActivatedRoute,
    public router: Router,
    public location: Location,
    public notifications: NotificationsService,
    public clientLocationService: ClientLocationService,
    public mapToolsService: MapToolsService,
    public sidenavService: SidenavService,
    public loadingIndicatorService: LoadingIndicatorService,
    public activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    super(
      newYorkBridgeService,
      searchService,
      snackBar,
      route,
      router,
      location,
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
    this.titleService.setTitle('IPA - Browse Bridges');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
