from django.db import connection

from routing.models import DriveTimeNode, WaysVerticesPgr


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
                "Have you invoked the 'execute' method?"
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
