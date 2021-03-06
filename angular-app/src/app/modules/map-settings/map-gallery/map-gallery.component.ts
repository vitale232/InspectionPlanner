import { Component, OnInit } from '@angular/core';
import { IContentCard } from 'src/app/shared/models/content-card.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-map-gallery',
  templateUrl: './map-gallery.component.html',
  styleUrls: ['./map-gallery.component.scss']
})
export class MapGalleryComponent implements OnInit {

  nColumns = 2;
  cardsContent: IContentCard[] = [
    {
      title: 'Browsable Map',
      subtitle: 'A GIS-like Experience!',
      avatarImgSrc: 'assets/layers_white.png',
      imgSrc: 'assets/openlayers_screenshot.jpg',
      paragraph:
        'This map provides a classical interface to interact with geospatial data. NYSDOT bridge locations are represented as ' +
        'points on the map. The appearance of the points can be customized with ease! You can use any of the bridges\'s attributes ' +
        'to apply styles using color ramps or customizable colors. There is also a collapsible, feature rich attribute table that ' +
        'syncs with the data on the map. This map is built using OpenLayers, and the table is built on top of the Angular CDK using ' +
        'the free and open-source nGrid package.',
      buttonText: 'Explore',
      link: '/'
    },
    {
      title: 'Marker Cluster',
      subtitle: 'An Interactive Cluster Analysis!',
      avatarImgSrc: 'assets/marker-icon-grey.png',
      imgSrc: 'assets/markercluster_screenshot.jpg',
      paragraph:
        'This map provides an auto-generated clustering of the NYSDOT brige locations. The features are clustered ' +
        'based on distance. The map is highly interactive. You can hover over a cluster to see its general shape, and you ' +
        'can click on a cluster to zoom the map\'s extent to the area. When you finally zoom in close enough, you will see ' +
        'individual markers for each bridge. A popup with attributes is revealed when clicking on a bridge marker. ' +
        'This map is built using Leaflet and Leaflet Markercluster via the Asymmetrik Angular bindings.',
      buttonText: 'Explore',
      link: '/marker-cluster'
    }
  ];

  constructor( private titleService: Title ) { }

  ngOnInit() {
    this.titleService.setTitle('IPA - Map Gallery');
    this.getColumnsFromBreakpoint();
  }

  onResize(event) {
    this.getColumnsFromBreakpoint();
  }

  getColumnsFromBreakpoint(): void {
    if (window.innerWidth <= 740) {
      this.nColumns = 1;
    } else {
      this.nColumns = 2;
    }
  }

}
