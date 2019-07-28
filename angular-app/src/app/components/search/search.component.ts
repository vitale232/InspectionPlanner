import { Component, OnInit, ViewChild } from '@angular/core';
import { DriveTimeQueryApiResponse, DriveTimeQueryFeature } from '../../models/drive-time-queries.model';
import { DriveTimeQueryService } from 'src/app/services/drive-time-query.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  detailedPanelOpen = false;
  pastPanelOpen = false;
  driveTimeQueriesData: DriveTimeQueryFeature;
  driveTimeQueriesText: Array<string>;

  constructor(
    private driveTimeQueryService: DriveTimeQueryService,
  ) { }

  ngOnInit() {
    this.getRecentQueries();
    console.log('init');
  }

  getRecentQueries() {
    this.driveTimeQueryService.getDriveTimeQueries(1)
      .subscribe(
        (data: DriveTimeQueryApiResponse) => {
          this.driveTimeQueriesData = (data.results) as any;
          const uniqueSearchText = (data.results.features) as any;

          // Push the first 50 characters of the address to an array
          const searchTextArray = [];
          uniqueSearchText.forEach((feature) => {
            searchTextArray.push({
              shortName: feature.properties.display_name.substring(0, 50) + '...',
              longName: feature.properties.display_name
            });
          });
          console.log(searchTextArray);
          this.driveTimeQueriesText = Object.values(searchTextArray.reduce((unique, o) => {
            if (!unique[o.shortName]) {
              unique[o.shortName] = o;
            }

            return unique;
          }, {}));
          console.log('filteredArray');
          console.log(this.driveTimeQueriesText);
          // // Filter addresses for unique values
          // this.driveTimeQueriesText = searchTextArray.filter((value, index, arr) => {
          //   // arr.indexOf will return the first occurrence of the value in the
          //   // original array. If the index is different, it must be a duplicate
          //   return arr.indexOf(value) === index;
          // }).slice(0, 10);
        },
        err => { console.log(err); },
        () => { console.log('complete'); }
      );
  }

}
