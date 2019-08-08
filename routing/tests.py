from django.urls import resolve, reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

import routing.views as views
from routing.models import (
    Configuration, DriveTimeNode, DriveTimePolygon,
    DriveTimeQuery, Ways, WaysVerticesPgr
)

class WaysVerticesPgrTests(APITestCase):
    def setUp(self):
        self.ways_vert_pgrdata = {
            'id': 2319,
            'osm_id': 41692755,
            'eout': None,
            'lon': -73.55962700,
            'lat': 42.51304600,
            'cnt': 3,
            'chk': 0,
            'ein': None,
            'the_geom': 'SRID=4326;POINT (-73.55962700000001 42.513046)'
        }
        data = self.ways_vert_pgrdata

        ways_vertices_pgr = WaysVerticesPgr.objects.create(
            **data
        )

    def test_post_ways_vertices_pgr(self):
        start_count = WaysVerticesPgr.objects.count()
        url = reverse('ways-vertices-pgr-list')
        data = self.ways_vert_pgrdata
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(WaysVerticesPgr.objects.count(), start_count)
        # self.assertEqual(WaysVerticesPgr.objects.all().order_by('-created_time')[:1].get().osm_id, 2344038654)

    def test_get_ways_vertices_pgr(self):
        start_count = WaysVerticesPgr.objects.count()
        ways_vertices_pgr = WaysVerticesPgr.objects.all().order_by('-lon')[:1].get()
        url = reverse('ways-vertices-pgr-detail', kwargs={'pk': ways_vertices_pgr.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['properties']['osm_id'], ways_vertices_pgr.osm_id)
        self.assertEqual(WaysVerticesPgr.objects.count(), start_count)
    
    def test_delete_ways_vertices_pgr(self):
        start_count = WaysVerticesPgr.objects.count()
        ways_vertices_pgr = WaysVerticesPgr.objects.all().order_by('-lon')[:1].get()
        url = reverse('ways-vertices-pgr-detail', kwargs={'pk': ways_vertices_pgr.pk})
        response = self.client.delete(url, {'id': ways_vertices_pgr.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(WaysVerticesPgr.objects.count(), start_count)
        # self.assertIsNone(response.data)


class WaysTests(APITestCase):
    def setUp(self):
        ways_vertices_pgr = WaysVerticesPgr.objects.create(
            **RoutingApiUrlTest.WAYS_VERTICES_PGR_DATA
        )
        self.ways_data = {
            "osm_id": 5611497,
            "length": 0.00519409361291285,
            "length_m": 479.261682035277,
            "name": None,
            "cost": 0.00519409361291285,
            "reverse_cost": 0.00519409361291285,
            "cost_s": 34.5068411065399,
            "reverse_cost_s": 34.5068411065399,
            "rule": None,
            "one_way": 0,
            "oneway": "UNKNOWN",
            "x1": -73.559627,
            "y1": 42.513046,
            "x2": -73.555567,
            "y2": 42.515796,
            "maxspeed_forward": 50.0,
            "maxspeed_backward": 50.0,
            "priority": 2.5,
            "tag": None,
            "source": ways_vertices_pgr,
            "target": ways_vertices_pgr,
            "source_osm": ways_vertices_pgr,
            "target_osm": ways_vertices_pgr,
            "the_geom": (
                'SRID=4326;LINESTRING (' +
                '-73.55962700000001 42.513046, ' +
                '-73.559073 42.513495, -73.55913200000001 42.51377, ' + 
                '-73.558581 42.513973, -73.558031 42.514089, -73.557303 42.51432, ' + 
                '-73.55673299999999 42.514697, -73.55634000000001 42.515102, ' + 
                '-73.555671 42.515696, -73.555567 42.515796)'
            )
        }
        data = self.ways_data
        ways = Ways.objects.create(
            **data
        )

    def test_post_ways(self):
        start_count = Ways.objects.count()
        ways = Ways.objects.all().order_by('-cost')[:1].get()
        url = reverse('ways-detail', kwargs={'pk': ways.pk})
        data = self.ways_data
        if not type(data['source']) is int:
            data['source'] = self.ways_data['source'].id
        if not type(data['target']) is int:
            data['target'] = self.ways_data['target'].id
        if not type(data['source_osm']) is int:
            data['source_osm'] = self.ways_data['source_osm'].id
        if not type(data['target_osm']) is int:
            data['target_osm'] = self.ways_data['target_osm'].id
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Ways.objects.count(), start_count)
        # self.assertEqual(Ways.objects.all().order_by('-created_time')[:1].get().osm_id, 2344038654)

    def test_get_ways(self):
        start_count = Ways.objects.count()
        ways = Ways.objects.all().order_by('-cost')[:1].get()
        url = reverse('ways-detail', kwargs={'pk': ways.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['properties']['osm_id'], ways.osm_id)
        self.assertEqual(Ways.objects.count(), start_count)
    
    def test_delete_ways(self):
        start_count = Ways.objects.count()
        ways = Ways.objects.all().order_by('-cost')[:1].get()
        url = reverse('ways-detail', kwargs={'pk': ways.pk})
        response = self.client.delete(url, {'id': ways.pk}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Ways.objects.count(), start_count)
        # self.assertIsNone(response.data)



class DriveTimeNodeTests(APITestCase):
    def setUp(self):
        ways_vertices_pgr = WaysVerticesPgr.objects.create(
            **RoutingApiUrlTest.WAYS_VERTICES_PGR_DATA
        )
        self.drive_time_node_data = {
            'agg_cost': 0.031669950271386,
            'cost': 0.00307276130123879,
            'created_time': '2019-07-14T11:00:00.868265Z',
            'drive_time_query': None,
            'edge': 476826,
            'edited_time': '2019-07-14T11:00:00.868274Z',
            'lat': 41.796805,
            'lon': -74.740023,
            'node': 433019,
            'osm_id': 2344038654,
            'seq': 100,
            'the_geom': 'POINT(-74.740023 41.796805)',
            'ways_vertices_pgr': ways_vertices_pgr.id,
        }
        data = self.drive_time_node_data
        data['ways_vertices_pgr'] = WaysVerticesPgr.objects.get(id=ways_vertices_pgr.id)
        drive_time_node = DriveTimeNode.objects.create(
            **data
        )

    def test_post_drive_time_node(self):
        start_count = DriveTimeNode.objects.count()
        url = reverse('drive-time-node-list')
        data = self.drive_time_node_data
        if not type(data['ways_vertices_pgr']) is int:
            data['ways_vertices_pgr'] = self.drive_time_node_data['ways_vertices_pgr'].id
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(DriveTimeNode.objects.count(), start_count)
        # self.assertEqual(DriveTimeNode.objects.all().order_by('-created_time')[:1].get().osm_id, 2344038654)

    def test_get_drive_time_node(self):
        start_count = DriveTimeNode.objects.count()
        drive_time_node = DriveTimeNode.objects.all().order_by('-created_time')[:1].get()
        url = reverse('drive-time-node-detail', kwargs={'pk': drive_time_node.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['properties']['osm_id'], drive_time_node.osm_id)
        self.assertEqual(DriveTimeNode.objects.count(), start_count)
    
    def test_delete_drive_time_node(self):
        start_count = DriveTimeNode.objects.count()
        drive_time_node = DriveTimeNode.objects.all().order_by('-created_time')[:1].get()
        url = reverse('drive-time-node-detail', kwargs={'pk': drive_time_node.pk})
        response = self.client.delete(url, {'id': drive_time_node.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(DriveTimeNode.objects.count(), start_count)
        # self.assertIsNone(response.data)


class DriveTimeQueryTests(APITestCase):
    def setUp(self):
        ways_vertices_pgr = WaysVerticesPgr.objects.create(
            **RoutingApiUrlTest.WAYS_VERTICES_PGR_DATA
        )
        self.drive_time_query_data = {
            'search_text': '50 Wolf Road, Albany, NY',
            'place_id': 104728296 ,
            'osm_type': 'secondary' ,
            'osm_id': 126673617 ,
            'lat': '42.7387471' ,
            'lon': '-73.7907121' ,
            'display_name': 'Wolf Road, Shakers, Town of Colonie, Albany County, New York, 12110-9998, USA' ,
            'importance': 0.61 ,
            'bounding_box': ['42.7385631' ,
            '42.7388332' ,
            '-73.7908288' ,
            '-73.790586'] ,
            'osm_class': 'highway' ,
            'the_geom': 'POINT(-73.7907121 42.7387471)',
        }
        data = self.drive_time_query_data
        data['ways_vertices_pgr_source'] = WaysVerticesPgr.objects.get(id=ways_vertices_pgr.id)
        drive_time_query = DriveTimeQuery.objects.create(
            **data
        )

    def test_post_drive_time_query(self):
        start_count = DriveTimeQuery.objects.count()
        url = reverse('drive-time-query-list')
        data = self.drive_time_query_data
        data['ways_vertices_pgr_source'] = WaysVerticesPgr.objects.get(id=data['ways_vertices_pgr_source'].id)
        if not type(data['ways_vertices_pgr_source']) is int:
            data['ways_vertices_pgr_source'] = self.drive_time_query_data['ways_vertices_pgr_source'].id
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(DriveTimeQuery.objects.count(), start_count)
        # self.assertEqual(DriveTimeQuery.objects.all().order_by('-created_time')[:1].get().osm_id, 126673617)

    def test_get_drive_time_query(self):
        start_count = DriveTimeQuery.objects.count()
        drive_time_query = DriveTimeQuery.objects.all().order_by('-created_time')[:1].get()
        url = reverse('drive-time-query-detail', kwargs={'pk': drive_time_query.pk})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['properties']['osm_id'], drive_time_query.osm_id)
        self.assertEqual(DriveTimeQuery.objects.count(), start_count)
    
    def test_delete_drive_time_query(self):
        start_count = DriveTimeQuery.objects.count()
        drive_time_query = DriveTimeQuery.objects.all().order_by('-created_time')[:1].get()
        url = reverse('drive-time-query-detail', kwargs={'pk': drive_time_query.pk})
        response = self.client.delete(url, {'id': drive_time_query.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(DriveTimeQuery.objects.count(), start_count)
        # self.assertIsNone(response.data)


class RoutingApiUrlTest(TestCase):
    def setUp(self):
        ways_vertices_pgr = WaysVerticesPgr.objects.create(
            **self.WAYS_VERTICES_PGR_DATA
        )
        config = Configuration.objects.create(
            **self.CONFIGURATION_DATA
        )
        drive_time_node = DriveTimeNode.objects.create(
            ways_vertices_pgr=ways_vertices_pgr,
            **self.DRIVE_TIME_NODE_DATA
        )
        ways = Ways.objects.create(
            tag=config,
            source=ways_vertices_pgr,
            target=ways_vertices_pgr,
            source_osm=ways_vertices_pgr,
            target_osm=ways_vertices_pgr,
            **self.WAYS_DATA
        )

    def test_drive_time_node_list_url(self):
        found = resolve('/routing/drive-time-nodes/')
        self.assertEqual(found.func.view_class, views.DriveTimeNodeList)

    def test_drive_time_node_detail_url(self):
        drive_time_node = DriveTimeNode.objects.get(osm_id=2344038654)
        found = resolve(f'/routing/drive-time-nodes/{drive_time_node.pk}/')
        self.assertEqual(found.func.view_class, views.DriveTimeNodeDetail)

    def test_drive_time_polygon_list_url(self):
        found = resolve('/routing/drive-time-polygons/')
        self.assertEqual(found.func.view_class, views.DriveTimePolygonList)

    def test_drive_time_polygon_detail_url(self):
        found = resolve('/routing/drive-time-polygons/1/')
        self.assertEqual(found.func.view_class, views.DriveTimePolygonDetail)

    def test_drive_time_query_list_url(self):
        found = resolve('/routing/drive-time-queries/')
        self.assertEqual(found.func.view_class, views.DriveTimeQueryList)

    def test_drive_time_query_detail_url(self):
        found = resolve('/routing/drive-time-queries/1/')
        self.assertEqual(found.func.view_class, views.DriveTimeQueryDetail)

    def test_ways_list_url(self):
        found = resolve('/routing/ways/')
        self.assertEqual(found.func.view_class, views.WaysList)

    def test_ways_detail_url(self):
        ways = Ways.objects.get(osm_id=5645519)
        found = resolve(f'/routing/ways/{ways.pk}/')
        self.assertEqual(found.func.view_class, views.WaysDetail)

    def test_ways_vertices_pgr_list_url(self):
        found = resolve('/routing/ways-vertices-pgr/')
        self.assertEqual(found.func.view_class, views.WaysVerticesPgrList)

    def test_ways_vertices_pgr_detail_url(self):
        ways_vertices_pgr = WaysVerticesPgr.objects.get(osm_id=212310248)
        found = resolve(f'/routing/ways-vertices-pgr/{ways_vertices_pgr.pk}/')
        self.assertEqual(found.func.view_class, views.WaysVerticesPgrDetail)
    
    def test_query_drive_time_url(self):
        found = resolve('/routing/drive-time/')
        self.assertEqual(found.func.view_class, views.QueryDriveTime)

    WAYS_VERTICES_PGR_DATA = {
        'chk': 0,
        'cnt': 1,
        'ein': None,
        'eout': None,
        'lat': '43.85515100',
        'lon': '-73.75416800',
        'osm_id': 212310248,
        'the_geom': 'POINT(-73.754168 43.855151)'
    }

    DRIVE_TIME_NODE_DATA = {
        'agg_cost': 0.031669950271386,
        'cost': 0.00307276130123879,
        'created_time': '2019-07-14T11:00:00.868265Z',
        'drive_time_query': None,
        'edge': 476826,
        'edited_time': '2019-07-14T11:00:00.868274Z',
        'lat': 41.796805,
        'lon': -74.740023,
        'node': 433019,
        'osm_id': 2344038654,
        'seq': 100,
        'the_geom': 'POINT(-74.740023 41.796805)'
    }

    WAYS_DATA = {
        'cost': 0.00137627993419783,
        'cost_s': 8.84425760474878,
        'length': 0.00137627993419783,
        'length_m': 118.6122549931,
        'maxspeed_backward': 48.28038,
        'maxspeed_forward': 48.28038,
        'name': 'Hendricks Street',
        'one_way': 0,
        'oneway': 'UNKNOWN',
        'osm_id': 5645519,
        'priority': 2.5,
        'reverse_cost': 0.00137627993419783,
        'reverse_cost_s': 8.84425760474878,
        'rule': None,
        'x1': -73.9696465,
        'x2': -73.97093,
        'y1': 42.7923714,
        'y2': 42.791878,
        'the_geom':
            'LINESTRING(-73.9696465 42.7923714, -73.970528 42.792006, ' +
            '-73.970601 42.791978, -73.97093 42.791878)'
    }

    CONFIGURATION_DATA = {
        'tag_id': 112,
        'tag_key': 'highway',
        'tag_value': 'residential',
        'priority': 2.5,
        'maxspeed': 50.0,
        'maxspeed_forward': 50.0,
        'maxspeed_backward': 50.0,
        'force': 'N'
    }
