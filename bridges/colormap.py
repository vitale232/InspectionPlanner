import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from .models import NewYorkBridge


def get_rgbs(bins, field, colormap='viridis', mode='equalcount'):
    # Colormap currently supports perceptually uniform sequential
    # colormaps from matplotlib: 'viridis', 'plasma', 'inferno', 'magma', 'cividis'
    # https://matplotlib.org/3.1.0/tutorials/colors/colormaps.html
    vals = [getattr(bridge, field) for bridge in NewYorkBridge.objects.all()]

    cmap = plt.cm.get_cmap(colormap, bins)
    cmap_colors = cmap.colors.tolist()

    if mode == 'equalinterval':
        cuts = pd.cut(vals, bins, duplicates='drop')
    else:
        # Default to equal count
        cuts = pd.qcut(vals, bins, duplicates='drop')

    cuts_out = [list(cut) for cut in cuts.categories.to_tuples()]

    cuts_out[0][0] = np.min(vals)
    cuts_out[-1][1] = np.max(vals)

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
            'min': np.min(vals),
            'max': np.max(vals),
            'mean': round(np.mean(vals), 3),
            'median': np.median(vals),
            'count': len(vals),
            'std': round(np.std(vals), 3),
            'q25': quartiles[0],
            'q50': quartiles[1],
            'q75': quartiles[2],
        },
        'cuts': {
            'intervals': cuts_out,
            'closed': cuts.categories.closed,
            'rgb_colors': colors_out,
        },
    }

    return color_stats
