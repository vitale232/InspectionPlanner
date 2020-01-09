import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from .models import NewYorkBridge


def get_rgbs(bins, field, colormap='viridis', mode='equalcount'):
    # Colormap currently supports perceptually uniform sequential
    # colormaps from matplotlib: 'viridis', 'plasma', 'inferno', 'magma', 'cividis'
    # https://matplotlib.org/3.1.0/tutorials/colors/colormaps.html
    vals = [getattr(bridge, field) for bridge in NewYorkBridge.objects.all()]

    if mode == 'equalinterval':
        cuts = pd.cut(vals, bins, duplicates='drop')
    else:
        # Default to equal count
        cuts = pd.qcut(vals, bins, duplicates='drop')

    cuts_out = [list(cut) for cut in cuts.categories.to_tuples()]
    cuts_out[0][0] = np.min(vals) - 0.001
    cuts_out[-1][1] = np.max(vals)

    cmap = plt.cm.get_cmap(colormap, len(cuts_out))
    cmap_colors = cmap.colors.tolist()

    colors_out = []
    for color in cmap_colors:
        colors_out.append([
            round(color[0] * 255),
            round(color[1] * 255),
            round(color[2] * 255),
        ])

    quartiles = np.quantile(vals, [0.25, 0.5, 0.75]).tolist()
    color_stats = {
        'input_params': {
            'bins': bins,
            'colormap': colormap,
            'field': field,
            'mode': mode,
        },
        'stats': {
            'count': len(vals),
            'mean': round(np.mean(vals), 3),
            'median': np.median(vals),
            'std': round(np.std(vals), 3),
            'min': np.min(vals),
            'q25': quartiles[0],
            'q50': quartiles[1],
            'q75': quartiles[2],
            'max': np.max(vals),
        },
        'cuts': {
            'intervals': cuts_out,
            'closed': cuts.categories.closed,
            'rgb_colors': colors_out,
        },
    }

    return color_stats
