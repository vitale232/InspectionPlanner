export interface IColormapQueryParams {
  bins: number;
  colormap: string;
  field: string;
  mode: 'equalcount' | 'equalinterval';
}

export interface IColormapCuts {
  intervals: Array<[number, number]>;
  closed: 'left' | 'right';
  rgb_colors: Array<[number, number, number]>;
}

export interface IColormapStats {
  count: number;
  mean: number;
  median: number;
  std: number;
  min: number;
  q25: number;
  q50: number;
  q75: number;
  max: number;
}

export interface IColormap {
  input_params: IColormapQueryParams;
  stats: IColormapStats;
  cuts: IColormapCuts;
}

export interface IColormapPreview {
  minValue: number;
  maxValue: number;
  rgb: string;
}

export interface IDistinctField {
  field: string;
  distinct: string[];
  count: number;
}

export interface IDistinctColormap {
  field: string;
  distinct: string[];
  count: number;
  rgbColors: string[];
}

export interface IDistinctFieldPreview {
  value: string;
  rgb: string;
}
