import os

from django.contrib.gis.utils import LayerMapping

from .models import NewYorkBridge

nysdot_bridges = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        'data',
        'Bridges_Feb2019_ll.shp'
    )
)

newyorkbridge_mapping = {
    'bin': 'BIN',
    'common_name': 'COMMON_NAM',
    'local_bridge': 'LOCAL_BRID',
    'region': 'REGION',
    'county_name': 'COUNTY_NAM',
    'political_field': 'POLITICAL_',
    'carried': 'CARRIED',
    'crossed': 'CROSSED',
    'crossed_mi': 'CROSSED_MI',
    'crossed_to': 'CROSSED_TO',
    'location': 'LOCATION',
    'latitude': 'LATITUDE',
    'longitude': 'LONGITUDE',
    'primary_owner': 'PRIMARY_OW',
    'primary_maintainer': 'PRIMARY_MA',
    'condition_field': 'CONDITION_',
    'inspection': 'INSPECTION',
    'bridge_length': 'BRIDGE_LEN',
    'curb_to_curb': 'CURB_TO_CU',
    'deck_area_field': 'DECK_AREA_',
    'aadt': 'AADT',
    'year_of_aadt': 'YEAR_OF_AA',
    'gtms_mater': 'GTMS_MATER',
    'gtms_structure': 'GTMS_STRUC',
    'year_built': 'YEAR_BUILT',
    'posted_load': 'POSTED_LOA',
    'restricted': 'RESTRICTED',
    'r_posted': 'R_POSTED',
    'other': 'OTHER',
    'other_post': 'OTHER_POST',
    'posted_leg': 'POSTED_LEG',
    'posting_co': 'POSTING_CO',
    'total_hz_c': 'TOTAL_HZ_C',
    'total_hz_1': 'TOTAL_HZ_1',
    'posted_vrt': 'POSTED_VRT',
    'posted_v_1': 'POSTED_V_1',
    'state_owned': 'STATE_OWNE',
    'permitted_field': 'PERMITTED_',
    'permitted_1': 'PERMITTE_1',
    'carried_la': 'CARRIED_LA',
    'the_geom': 'POINT',
}

def run(verbose=True):
    lm = LayerMapping(
        NewYorkBridge, nysdot_bridges,
        newyorkbridge_mapping, transform=True
    )
    lm.save(strict=True, verbose=verbose)
