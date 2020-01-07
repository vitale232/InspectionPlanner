import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IColormap, IColormapPreview } from 'src/app/shared/models/map-settings.model';
import { ColormapStoreService } from 'src/app/shared/stores/colormap-store.service';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-symbology-preview',
  templateUrl: './symbology-preview.component.html',
  styleUrls: ['./symbology-preview.component.scss']
})
export class SymbologyPreviewComponent implements OnInit {

  @Input() colormap$: Observable<IColormap>;

  tableData: IColormapPreview[];
  tableDataSource: MatTableDataSource<IColormapPreview>;
  displayedColumns = [ 'rgb', 'minValue', 'maxValue', ];

  binCountCorrect = true;
  binCount: number;
  desiredBinCount: number;
  subscriptions = new Subscription();

  constructor( private colormapStore: ColormapStoreService ) { }

  ngOnInit() {
    this.subscriptions.add(this.colormapStore.colormap$.subscribe(
      data => {
        console.log('subscribed in ts', data);
        if (data && data.cuts) {
          this.tableData = data.cuts.rgb_colors.map((element, i) => {
            console.log(`i ${i}`);
            return {
              minValue: data.cuts.intervals[i][0],
              maxValue: data.cuts.intervals[i][1],
              rgb: `rgba(${element[0]}, ${element[1]}, ${element[2]}, 0.75)`
            };
          });
          // Check if pandas.qcut returned the desired number of bins
          this.binCount = data.input_params.bins;
          this.desiredBinCount = data.cuts.intervals.length;
          this.binCountCorrect = this.desiredBinCount === this.binCount;
        }
        console.log('tableData', this.tableData);
        this.tableDataSource = new MatTableDataSource(this.tableData);
      },
      err => console.error(err)
    ));
  }

}
