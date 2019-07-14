from django.db import connection

from routing.models import DriveTimeNode, WaysVerticesPgr


class DriveTime:
    def __init__(self, node_id, max_drive_time):
        self.node_id = node_id
        self.max_drive_time = max_drive_time
        self.rows = None
        self.models = None
    
    def execute(self):
        with connection.cursor() as cursor:
            cursor.execute(
                'SELECT * FROM pgr_driveTime(%s, %s);',
                [self.node_id, self.max_drive_time]
            )
            rows = cursor.fetchall()
        self.rows = rows
        return rows
    
    def to_models(self, drive_time_query=None):
        if not self.rows:
            raise AttributeError(
                "'DriveTime' object requires 'execute' method invocation " +
                "prior to calling 'to_models'"
            )
        models = [
            DriveTimeNode(**{
                'ways_vertex_pgr': WaysVerticesPgr(row[0]),
                'osm_id': row[1],
                'lon': row[2],
                'lat': row[3],
                'the_geom': row[4],
                'seq': row[5],
                'node': row[6],
                'edge': row[7],
                'cost': row[8],
                'agg_cost': row[9],
                'drive_time_query': drive_time_query,
            }) for row in self.rows
        ]
        self.models = models
        return models
