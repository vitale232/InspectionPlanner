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
  field: string;
  subscriptions = new Subscription();

  constructor( private colormapStore: ColormapStoreService ) { }

  ngOnInit() {
    this.subscriptions.add(this.colormapStore.colormap$.subscribe(
      (data: IColormap) => {
        if (data && data.cuts) {
          this.tableData = data.cuts.rgb_colors.map((rgbColors, i) => {
            return {
              minValue: data.cuts.intervals[i][0],
              maxValue: data.cuts.intervals[i][1],
              rgb: `rgba(${rgbColors[0]}, ${rgbColors[1]}, ${rgbColors[2]}, 1)`
            };
          });
          // Check if pandas.qcut returned the desired number of bins
          this.binCount = data.cuts.intervals.length;
          this.desiredBinCount = data.input_params.bins;
          this.binCountCorrect = this.desiredBinCount === this.binCount;
          this.field = data.input_params.field;
          this.tableDataSource = new MatTableDataSource(this.tableData);
        } else {
          this.tableData = null;
          this.tableDataSource = null;
        }
      },
      err => console.error(err)
    ));
  }

}
