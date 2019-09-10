import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NewYorkBridgeService } from 'src/app/services/new-york-bridge.service';
import { SearchService } from 'src/app/services/search.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { ClientLocationService } from 'src/app/services/client-location.service';
import { MapToolsService } from 'src/app/services/map-tools.service';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-drive-time-results-map',
  templateUrl: './drive-time-results-map.component.html',
  styleUrls: ['./drive-time-results-map.component.css']
})
export class DriveTimeResultsMapComponent extends MapComponent implements OnInit {

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
    public sidenavService: SidenavService
  ) {
    super(
      newYorkBridgeService, searchService, snackBar, route,
      router, location, changeDetector, notifications, clientLocationService,
      mapToolsService, sidenavService
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
