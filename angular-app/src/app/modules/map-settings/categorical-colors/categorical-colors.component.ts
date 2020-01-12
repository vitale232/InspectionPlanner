import { Component, OnInit } from '@angular/core';
import { ISelectOption } from 'src/app/shared/models/bridges.model';
import { FormBuilder, Validators } from '@angular/forms';
import { DistinctFieldsService } from 'src/app/shared/services/distinct-fields.service';
import { IDistinctColormap, IDistinctField, IDistinctFieldPreview } from 'src/app/shared/models/map-settings.model';
import { ColormapStoreService } from 'src/app/shared/stores/colormap-store.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { defaultColormap } from 'src/app/shared/components/open-layers-map/default-colormap';
import { BrowserHistoryService } from 'src/app/shared/services/browser-history.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-categorical-colors',
  templateUrl: './categorical-colors.component.html',
  styleUrls: ['./categorical-colors.component.scss']
})
export class CategoricalColorsComponent implements OnInit {

  fieldOptions: ISelectOption[] = [
    { value: 'region', viewOption: 'NYSDOT Region' },
    { value: 'political_field', viewOption: 'Municipality' },
    { value: 'primary_owner', viewOption: 'Primary Owner' },
    { value: 'primary_maintainer', viewOption: 'Primary Maintainer' },
    { value: 'gtms_material', viewOption: 'Material Type' },
    { value: 'gtms_structure', viewOption: 'Structure Type' },
    { value: 'posted_leg', viewOption: 'Posted Leg' },
    { value: 'state_owned', viewOption: 'State Owned' },
  ].sort((a, b) => a.viewOption > b.viewOption ? 1 : -1);

  loading = false;
  fieldControl = this.fb.control('', Validators.required);
  previousUrl: string;
  subscriptions: Subscription;

  tableData: IDistinctFieldPreview[];
  tableDataSource: MatTableDataSource<IDistinctFieldPreview>;
  selection = new SelectionModel<IDistinctFieldPreview>(true, []);
  displayedColumns = [ 'select', 'rgb', 'value', ];

  constructor(
    private fb: FormBuilder,
    private distinctFieldsService: DistinctFieldsService,
    private colormapStore: ColormapStoreService,
    private browserHistory: BrowserHistoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.previousUrl = this.browserHistory.previousUrl;
    this.subscriptions.add(this.colormapStore.colormap$.subscribe(
      data => console.log('colormap$ from categorical component', data)
    ))
  }

  randomRGBArray(count, alpha: number = 0.95) {
    const randomInt = () => Math.floor(Math.random() * 255);
    const rgbArray = [];
    for (let i = 0; i < count; i++) {
      rgbArray.push(`rgba(${randomInt()}, ${randomInt()}, ${randomInt()}, ${alpha})`);
    }
    return rgbArray;
  }

  onPreview(): void {
    this.loading = true;

    this.distinctFieldsService.getFieldValues(this.fieldControl.value).subscribe(
      (data: IDistinctField) => {
        (data as IDistinctColormap).rgbColors = this.randomRGBArray(data.count);
        // this.colormapStore.colormap = (data as IDistinctColormap);
        this.tableData = [];
        (data as IDistinctColormap).rgbColors.forEach((rgb, index) => {
          this.tableData.push({
            value: (data as IDistinctColormap).distinct[index],
            rgb
          });
        });
        this.tableData.sort((a, b) => a.value > b.value ? 1 : -1);
        this.tableDataSource = new MatTableDataSource(this.tableData);
      },
      err => {
        console.error(err);
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.tableDataSource.data.forEach(row => this.selection.select(row));
  }

  onApply() {
    console.log('APPLY!');
    console.log(this.selection);
    console.log('selected', this.selection.selected);
    const colormap: IDistinctColormap = {
      field: this.fieldControl.value,
      distinct: this.selection.selected.map((row: IDistinctFieldPreview) => row.value),
      count: this.selection.selected.length,
      rgbColors: this.selection.selected.map((row: IDistinctFieldPreview) => row.rgb)
    };
    console.log('colormap', colormap);
    this.colormapStore.colormap = colormap;
  }

  onRestoreDefault(): void {
    this.colormapStore.colormap = defaultColormap;
  }

  onClose(): void {
    if (this.previousUrl) {
      this.router.navigateByUrl(this.previousUrl);
    } else {
      this.router.navigate(['/'], { queryParamsHandling: 'merge' });
    }
  }

}
