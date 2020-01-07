export interface IColormapQueryParams {
  bins: number;
  colormap: string;
  field: string;
  mode: 'equalcount' | 'equalinterval';
}

export interface IColormapApiResponse {
  input_params: IColormapQueryParams;
  stats: {
    count: number;
    mean: number;
    median: number;
    std: number;
    min: number;
    q25: number;
    q50: number;
    q75: number;
    max: number;
  };
  cuts: {
    intervals: Array<[number, number]>;
    closed: 'left' | 'right';
    rgb_colors: Array<[number, number, number]>
  };
}
