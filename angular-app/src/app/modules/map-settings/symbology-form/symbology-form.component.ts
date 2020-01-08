import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ISelectOption } from 'src/app/shared/models/bridges.model';
import { ColormapService } from 'src/app/shared/services/colormap.service';
import { ColormapStoreService } from 'src/app/shared/stores/colormap-store.service';
import { IColormapQueryParams } from 'src/app/shared/models/map-settings.model';

@Component({
  selector: 'app-symbology-form',
  templateUrl: './symbology-form.component.html',
  styleUrls: ['./symbology-form.component.scss']
})
export class SymbologyFormComponent implements OnInit {

  loading = false;

  colorMapOptions: ISelectOption[] = [
    { value: 'viridis', viewOption: 'Viridis' },
    { value: 'plasma', viewOption: 'Plasma' },
    { value: 'inferno', viewOption: 'Inferno' },
    { value: 'magma', viewOption: 'Magma' },
    { value: 'cividis', viewOption: 'Cividis' },
  ].sort((a, b) => a.viewOption > b.viewOption ? 1 : -1);

  fieldOptions: ISelectOption[] = [
    { value: 'condition_field', viewOption: 'Condition Rating' },
    { value: 'bridge_length', viewOption: 'Bridge Length' },
    { value: 'curb_to_curb', viewOption: 'Curb to Curb Width' },
    { value: 'deck_area_field', viewOption: 'Deck Area' },
    { value: 'aadt', viewOption: 'Annual Average Daily Traffic (AADT)' },
    { value: 'year_of_aadt', viewOption: 'Year of AADT Estimate' },
    { value: 'year_built', viewOption: 'Year Constructed' },
    { value: 'posted_load', viewOption: 'Posted Load' },
    { value: 'restricted', viewOption: 'Restricted' },
    { value: 'total_hz_c', viewOption: 'Total Horizontal Clearance' },
    { value: 'posted_vrt', viewOption: 'Posted Vertical Clearance' },
  ].sort((a, b) => a.viewOption > b.viewOption ? 1 : -1);

  modeOptions: ISelectOption[] = [
    { value: 'equalcount', viewOption: 'Equal Count' },
    { value: 'equalinterval', viewOption: 'Equal Interval' },
  ];

  colormapForm = this.fb.group({
    bins: [5, [Validators.min(1), Validators.required]],
    colormap: ['', Validators.required],
    field: ['', Validators.required],
    mode: ['', Validators.required],
  });
  invertColormap = this.fb.control(false);

  constructor(
    private fb: FormBuilder,
    private colormapService: ColormapService,
    private colormapStore: ColormapStoreService,
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    this.loading = true;
    const queryParams: IColormapQueryParams = {
      bins: this.colormapForm.value.bins,
      colormap: this.invertColormap.value ? `${this.colormapForm.value.colormap}_r`
                                          : this.colormapForm.value.colormap,
      field: this.colormapForm.value.field,
      mode: this.colormapForm.value.mode
    };
    this.colormapService.getColormap(queryParams).subscribe(
      colormapData => this.colormapStore.colormap = colormapData,
      err => {
        console.error('getColormap error', err);
        this.loading = false;
      },
      () => this.loading = false
    );
  }

}
