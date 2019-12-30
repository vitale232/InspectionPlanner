import { Component, OnInit } from '@angular/core';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { Observable, Subscription } from 'rxjs';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { SearchMarker } from 'src/app/shared/models/markers.model';
import { LoadingIndicatorService } from 'src/app/shared/services/loading-indicator.service';
import { SearchMarkersStoreService } from 'src/app/shared/stores/search-markers-store.service';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-drive-time-display',
  templateUrl: './drive-time-display.component.html',
  styleUrls: ['./drive-time-display.component.scss']
})
export class DriveTimeDisplayComponent implements OnInit {

  driveTimeID: number;

  loading$: Observable<boolean>;
  driveTimeBridges$: Observable<IBridgeFeature[]>;
  searchMarkers$: Observable<SearchMarker[]>;

  subscriptions = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private bridgesStore: BridgesStoreService,
    private loadingIndicatorService: LoadingIndicatorService,
    private router: Router,
    private searchMarkerStore: SearchMarkersStoreService,
    private titleService: Title,
  ) {
    this.driveTimeBridges$ = this.bridgesStore.driveTimeBridges$;
    this.loading$ = this.loadingIndicatorService.loading$;
    this.searchMarkers$ = this.searchMarkerStore.searchMarker$;
    console.log('this.searchMarkers$,', this.searchMarkers$);


  }

  ngOnInit() {
    this.subscriptions.add(this.activatedRoute.params.subscribe(
      params => {
        console.log(params);
        this.driveTimeID = parseInt(params.driveTimeID, 10);
        this.titleService.setTitle(`IPA - Drive Time ${this.driveTimeID}`);
        this.checkAndFetchDriveTime();
      },
      err => console.error(err),
      () => console.log('activatedRouter sub complete!')
    ));
  }

  onMapMove(event) {
    console.log('dt onMapMove event', event);
  }

  checkAndFetchDriveTime() {
    if (this.bridgesStore.driveTimeID !== this.driveTimeID) {
      this.bridgesStore.fetchDriveTimeBridges(this.driveTimeID);
    }
  }

}
