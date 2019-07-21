from django.urls import resolve
from django.test import TestCase

import routing.views as views
from routing.models import (
    Configuration, DriveTimeNode, DriveTimePolygon,
    DriveTimeQuery, Ways, WaysVerticesPgr
)


class RoutingApiTest(TestCase):
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
    
    def test_drive_time_query_list_url(self):
        found = resolve('/routing/drive-time-queries/')
        self.assertEqual(found.func.view_class, views.DriveTimeQueryList)
    
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

    WAYS_VERTICES_PGR_DATA = {
        "chk": 0,
        "cnt": 1,
        "ein": None,
        "eout": None,
        "lat": "43.85515100",
        "lon": "-73.75416800",
        "osm_id": 212310248,
        "the_geom": "POINT(-73.754168 43.855151)"
    }

    DRIVE_TIME_NODE_DATA = {
        "agg_cost": 0.031669950271386,
        "cost": 0.00307276130123879,
        "created_time": "2019-07-14T11:00:00.868265Z",
        "drive_time_query": None,
        "edge": 476826,
        "edited_time": "2019-07-14T11:00:00.868274Z",
        "lat": 41.796805,
        "lon": -74.740023,
        "node": 433019,
        "osm_id": 2344038654,
        "seq": 100,
        "the_geom": "POINT(-74.740023 41.796805)"
    }

    WAYS_DATA = {
        "cost": 0.00137627993419783,
        "cost_s": 8.84425760474878,
        "length": 0.00137627993419783,
        "length_m": 118.6122549931,
        "maxspeed_backward": 48.28038,
        "maxspeed_forward": 48.28038,
        "name": "Hendricks Street",
        "one_way": 0,
        "oneway": "UNKNOWN",
        "osm_id": 5645519,
        "priority": 2.5,
        "reverse_cost": 0.00137627993419783,
        "reverse_cost_s": 8.84425760474878,
        "rule": None,
        "x1": -73.9696465,
        "x2": -73.97093,
        "y1": 42.7923714,
        "y2": 42.791878,
        "the_geom": 
            "LINESTRING(-73.9696465 42.7923714, -73.970528 42.792006, " +
            "-73.970601 42.791978, -73.97093 42.791878)"
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
