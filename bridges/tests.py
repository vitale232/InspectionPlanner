from django.urls import resolve, reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

import bridges.views as views
from bridges.models import NewYorkBridge


class NewYorkBridgeTests(APITestCase):
    def setUp(self):
        self.bridge_data = {
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
            'created_time': None,
            'edited_time': None,
            'the_geom': 'POINT(-77.3855100332751 42.5313329735662)'
        }
        new_york_bridge = NewYorkBridge.objects.create(
            **self.bridge_data
        )

    def test_post_new_york_bridge(self):
        start_count = NewYorkBridge.objects.count()
        url = reverse('new-york-bridge-list')
        data = self.bridge_data
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['properties']['bin'], '3369950')
        self.assertEqual(NewYorkBridge.objects.count(), start_count+1)
    
    def test_get_new_york_bridge(self):
        start_count = NewYorkBridge.objects.count()
        new_york_bridge = NewYorkBridge.objects.all().order_by('-created_time')[:1].get()
        url = reverse('new-york-bridge-detail', kwargs={'pk': new_york_bridge.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['properties']['bin'], '3369950')
        self.assertEqual(NewYorkBridge.objects.count(), start_count)

    def test_delete_new_york_bridge(self):
        start_count = NewYorkBridge.objects.count()
        new_york_bridge = NewYorkBridge.objects.all().order_by('-created_time')[:1].get()
        url = reverse('new-york-bridge-detail', kwargs={'pk': new_york_bridge.pk})
        response = self.client.delete(url, {'pk': new_york_bridge.pk})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(NewYorkBridge.objects.count(), start_count-1)
        self.assertIsNone(response.data)


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