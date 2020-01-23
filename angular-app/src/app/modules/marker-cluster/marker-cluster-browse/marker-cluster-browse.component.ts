import { Component, OnInit } from '@angular/core';
import { BridgesStoreService } from 'src/app/shared/stores/bridges-store.service';
import { Observable } from 'rxjs';
import { IBridgeFeature } from 'src/app/shared/models/bridges.model';
import { Title } from '@angular/platform-browser';
import { pluck, filter } from 'rxjs/operators';

@Component({
  selector: 'app-marker-cluster-browse',
  templateUrl: './marker-cluster-browse.component.html',
  styleUrls: ['./marker-cluster-browse.component.scss']
})
export class MarkerClusterBrowseComponent implements OnInit {

  bridges$: Observable<IBridgeFeature[]>;

  constructor(
    private bridgesStore: BridgesStoreService,
    private titleService: Title,
  ) {
    this.bridges$ = bridgesStore.allBridges$.pipe(
      filter(x => x !== null),
      pluck('features')
    );
  }

  ngOnInit() {
    this.bridgesStore.fetchAllBridges();
    this.titleService.setTitle('IPA - Marker Cluster');
  }

}
