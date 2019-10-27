from datetime import datetime
import math

from django.db import connection
import numpy as np
import shapely.geometry as geometry
from shapely.ops import cascaded_union, polygonize
from shapely.wkt import loads
from scipy.spatial import Delaunay


from routing.models import DriveTimeNode, WaysVerticesPgr, DriveTimePolygon


class DriveTime:
    def __init__(self, node_id, max_drive_time):
        self.node_id = node_id
        self.max_drive_time = max_drive_time
        self.rows = None
        self.models = None
    
    def __str__(self):
        return f'SELECT * FROM pgr_driveTime({self.node_id}, {self.max_drive_time});'
    
    def execute_sql(self):
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT * FROM pgr_driveTime(%s, %s);',
                [self.node_id, self.max_drive_time]
            )
            self.rows = cursor.fetchall()
        return self.rows
    
    def to_models(self, drive_time_query=None):
        if not self.rows:
            raise AttributeError(
                "Attribute 'rows' of 'DriveTime' does not exist. " +
                "Have you invoked the 'execute_sql' method?"
            )
        self.models = [
            DriveTimeNode(
                ways_vertices_pgr=WaysVerticesPgr(row[0]),
                osm_id=row[1],
                lon=row[2],
                lat=row[3],
                the_geom=row[4],
                seq=row[5],
                node=row[6],
                edge=row[7],
                cost=row[8],
                agg_cost=row[9],
                drive_time_query=drive_time_query,
            ) for row in self.rows
        ]
        return self.models
    
    def to_polygon(self, alpha=1, drive_time_query=None):
        print(f'[{datetime.now()}] Starting polygon calc. Buckle up that RAM.')
        points = [loads(node.the_geom.wkt) for node in self.models]
        lens = [len(node.the_geom.wkt.encode('utf-8')) for node in self.models]
        print(f'message size in bytes: {sum(lens)}. too big? {sum(lens)>256000}')
        
        # Skip triangles
        if len(points) < 4:
            return geometry.MultiPoint(list(points)).convex_hull

        coords = np.array([point.coords[0] for point in points])
        tri = Delaunay(coords)
        triangles = coords[tri.vertices]
        a = (
            (triangles[:,0,0] - triangles[:,1,0]) ** 2 +
            (triangles[:,0,1] - triangles[:,1,1]) ** 2
        )**0.5
        b =(
            ((triangles[:,1,0] - triangles[:,2,0]) ** 2 +
            (triangles[:,1,1] - triangles[:,2,1]) ** 2) 
        )** 0.5
        c = (
            ((triangles[:,2,0] - triangles[:,0,0]) ** 2 +
            (triangles[:,2,1] - triangles[:,0,1]) ** 2) 
        )** 0.5
        s = ( a + b + c ) / 2.0
        areas = (s*(s-a)*(s-b)*(s-c)) ** 0.5
        circums = a * b * c / (4.0 * areas)
        filtered = triangles[circums < (1.0 / alpha)]
        edge1 = filtered[:,(0,1)]
        edge2 = filtered[:,(1,2)]
        edge3 = filtered[:,(2,0)]
        edge_points = np.unique(np.concatenate((edge1,edge2,edge3)), axis = 0).tolist()
        m = geometry.MultiLineString(edge_points)
        triangles = list(polygonize(m))
        concave_hull = cascaded_union(triangles)
        self.drive_time_polygon = DriveTimePolygon.objects.create(
            drive_time_query=drive_time_query,
            the_geom=concave_hull.buffer(0.005).wkt
        )
        self.drive_time_polygon.save()
        print(f'[{datetime.now()}] I did it!')
        return self.drive_time_polygon
