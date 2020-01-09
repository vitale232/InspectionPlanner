import { IColormap } from '../../models/map-settings.model';

export const defaultColormap: IColormap = {
  input_params: {
    bins: 5,
    colormap: 'viridis',
    field: 'aadt',
    mode: 'equalcount'
  },
  stats: {
    count: 19890,
    mean: 8422.517,
    median: 1169.0,
    std: 20908.982,
    min: 0.0,
    q25: 116.0,
    q50: 1169.0,
    q75: 6685.75,
    max: 283604.0
  },
  cuts: {
    intervals: [
      [ 0, 235 ],
      [ 235, 1005 ],
      [ 1005, 3735 ],
      [ 3735, 11350 ],
      [ 11350, 283604.0 ],
    ],
    closed: 'right',
    rgb_colors: [
      [ 68, 1, 84 ],
      [ 59, 81, 139 ],
      [ 33, 144, 141 ],
      [ 92, 200, 99 ],
      [ 253, 231, 37 ],
    ]
  }
};
