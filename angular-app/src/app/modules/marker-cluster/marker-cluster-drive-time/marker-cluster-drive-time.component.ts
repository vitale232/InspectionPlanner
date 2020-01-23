import { Component, OnInit } from '@angular/core';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { IDriveTimePolygonFeature } from 'src/app/shared/models/drive-time-polygons.model';
import { DriveTimePolygonStoreService } from 'src/app/shared/stores/drive-time-polygon-store.service';


@Component({
  selector: 'app-marker-cluster-drive-time',
  templateUrl: './marker-cluster-drive-time.component.html',
  styleUrls: ['./marker-cluster-drive-time.component.scss']
})
export class MarkerClusterDriveTimeComponent implements OnInit {

  bridges$: Observable<IBridgeFeature[]>;
  driveTimePolygon$: Observable<IDriveTimePolygonFeature>;

  subscriptions = new Subscription();
  driveTimeID: number;

  constructor(
    private bridgesStore: BridgesStoreService,
    private driveTimePolygonStore: DriveTimePolygonStoreService,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {
    this.bridges$ = this.bridgesStore.driveTimeBridges$;
    this.driveTimePolygon$ = this.driveTimePolygonStore.driveTimePolygon$;
  }

  ngOnInit() {
    this.subscriptions.add(this.activatedRoute.params.subscribe(
      params => {
        this.driveTimeID = parseInt(params.driveTimeID, 10);

        this.titleService.setTitle(`IPA - Marker Cluster Drive Time ${this.driveTimeID}`);
        this.checkAndFetchDriveTime();
      },
      err => console.error(err),
    ));
  }

  checkAndFetchDriveTime() {
    if (this.bridgesStore.driveTimeID !== this.driveTimeID) {
      this.bridgesStore.fetchDriveTimeBridges(this.driveTimeID);
    }
  }

}
