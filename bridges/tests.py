from django.urls import resolve
from django.test import TestCase

import bridges.views as views
from bridges.models import NewYorkBridge


class BridgesApiTest(TestCase):

    def test_new_york_bridges_list_url(self):
        found = resolve('/bridges/new-york-bridges/')
        self.assertEqual(found.func.view_class, views.NewYorkBridgeList)
    
    def test_new_york_bridges_detail_url(self):
        bridge = NewYorkBridge(**self.BRIDGE_DATA)
        bridge.save()
        found = resolve(f'/bridges/new-york-bridges/{bridge.pk}/')
        self.assertEqual(found.func.view_class, views.NewYorkBridgeDetail)

    BRIDGE_DATA = {
        'bin': '3369950',
        'common_name': '',
        'local_bridge': '9-7',
        'region': '6',
        'county_name': 'STEUBEN',
        'political_field': '0688 - Town of PRATTSBURG',
        'carried': 'COUNTY ROAD 9',
        'crossed': 'LYONS HLLOW CREEK',
        'crossed_mi': 'LYONS HLLOW CREEK',
        'crossed_to': 'LYONS HLLOW CREEK',
        'location': '1 MI S OF INGLESIDE',
        'latitude': 42.53133297,
        'longitude': -77.38551003,
        'primary_owner': '30 - County',
        'primary_maintainer': '30 - County',
        'condition_field': 6.47599983215332,
        'inspection': '2018-11-08',
        'bridge_length': 38.0,
        'curb_to_curb': 30.6,
        'deck_area_field': 1227.0,
        'aadt': 77.0,
        'year_of_aadt': 2013,
        'gtms_mater': '5 - Prestressed Concrete',
        'gtms_structure': '05 - Box Beam or Box Girders - Multiple',
        'year_built': 2002,
        'posted_load': 0.0,
        'restricted': 0.0,
        'r_posted': 'NO',
        'other': 0.0,
        'other_post': '',
        'posted_leg': 'N',
        'posting_co': 0.0,
        'total_hz_c': 28.6,
        'total_hz_1': 0.0,
        'posted_vrt': 0.0,
        'posted_v_1': 0.0,
        'state_owned': 'NO',
        'permitted_field': 99.99,
        'permitted_1': 0.0,
        'carried_la': 'COUNTY ROAD 9 :99\'99"',
        'created_time': '2019-07-13T12:20:32.536559Z',
        'edited_time': '2019-07-13T12:20:32.536622Z',
        'the_geom': 'POINT(-77.3855100332751 42.5313329735662)'
    }