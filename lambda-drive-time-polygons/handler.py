from datetime import datetime
import urllib.parse

import numpy as np
import shapely.geometry as geometry
from shapely.ops import cascaded_union, polygonize
from shapely.wkb import loads
from scipy.spatial import Delaunay

from sqlalchemy import create_engine, func, MetaData, update
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import geoalchemy2


def get_nodes_and_make_polygon(drive_time_query_id):
    print(f'[{datetime.now()}] get_nodes_and_make_polygon(): Setting up sqlalchemy')
    engine = create_engine(db_url_from_env(), echo=False)
    session = Session(engine)

    metadata = MetaData()

    metadata.reflect(engine, only=['routing_drivetimenode', 'routing_drivetimepolygon', 'bridges_newyorkbridge'])
    
    Base = automap_base(metadata=metadata)
    Base.prepare()

    # Reflecting on the metadata collects the routing_drivetimenode table,
    #  the routing_drivetimepolygon table, and their related tables 
    #  (routing_drivetimequery and ways_vertices_pgr)
    DriveTimeNode = Base.classes.routing_drivetimenode
    DriveTimePolygon = Base.classes.routing_drivetimepolygon
    DriveTimeQuery = Base.classes.routing_drivetimequery
    WaysVerticesPgr = Base.classes.ways_vertices_pgr
    NewYorkBridge = Base.classes.bridges_newyorkbridge

    # Get the routing_drivetimequery object that matches the message and the
    #  associated drivetimenodes
    drive_time_query = session.query(DriveTimeQuery).get(drive_time_query_id)
    drive_time_nodes = session.query(DriveTimeNode).filter(
        DriveTimeNode.routing_drivetimequery == drive_time_query
    ).all()

    print(f'[{datetime.now()}] Display name: {drive_time_query.display_name}')
    # Make a polygon object from the nodes
    print(
        f'[{datetime.now()}] get_nodes_and_make_polygon(): ' +
        f'Processing {len(drive_time_nodes)} nodes'
    )
    points = [loads(str(dtn.the_geom), hex=True) for dtn in drive_time_nodes]
    polygon = to_polygon(points, alpha=30)

    # Commit the results to the database
    new_drive_time_polygon = DriveTimePolygon(
        the_geom='SRID=4326;'+polygon.buffer(0.005).wkt,
        drive_time_query_id=drive_time_query_id,
        created_time=datetime.now(),
        edited_time=datetime.now(),
    )
    session.add(new_drive_time_polygon)

    session.flush()
    session.commit()

    print(f'[{datetime.now()}] get_nodes_and_make_polygon(): Committed polygon to db')

    print(f'[{datetime.now()}] Running intersect query on NewYorkBridge objects')
    bridges = session.query(NewYorkBridge).filter(
        NewYorkBridge.the_geom.ST_Intersects('SRID=4326;'+polygon.buffer(0.005).wkt)
    ).all()

    print(f'[{datetime.now()}] Iterating through {len(bridges)} bridges')
    for b in bridges:
        bridge = session.query(NewYorkBridge).filter(NewYorkBridge.id == b.id).first()
        drive_time_queries = bridge.drive_time_queries
        bridge.drive_time_queries = list(set(drive_time_queries + [drive_time_query_id]))
        session.add(bridge)

    drive_time_query.polygon_pending = False
    session.add(drive_time_query)

    print(
        f'[{datetime.now()}] get_nodes_and_make_polygon(): Set DriveTimeQuery' +
        f'.polygon_pending to {drive_time_query.polygon_pending}'
    )

    session.flush()
    session.commit()
    print(f'[{datetime.now()}] get_nodes_and_make_polygon(): Committed bridges to db')

    return True

def db_url_from_env():
    # Read the lambda env file to construct a database URL
    with open('./.lambda-env', 'r') as env_file:
        lines = env_file.readlines()
    keys_values = [line.split('=') for line in lines]
    # The environment variables need to be url encoded
    env = {
        key_value[0]: urllib.parse.quote_plus(key_value[1].strip('\n'))
        for key_value in keys_values
    }

    user = env['RDS_USERNAME']
    password = env['RDS_PASSWORD']
    host = env['RDS_HOSTNAME']
    port = env['RDS_PORT']
    db_name = env['RDS_DB_NAME']

    url = f'postgresql://{user}:{password}@{host}:{port}/{db_name}'

    return url

def to_polygon(points, alpha=1, drive_time_query=None):
    print(f'[{datetime.now()}] to_polygon() Starting polygon calc. Buckle up that RAM.')

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

    print(f'[{datetime.now()}] to_polygon() completed successfully')
    return concave_hull

def main(event, context):
    start_time = datetime.now()
    print(f'[{datetime.now()}] main(): event: {event}')
    print(f'[{datetime.now()}] main(): {context}')

    # SQS sends an event as a dict with a list of `Records`. Batch is currently
    # disallowed, so take the first and only element of the list (another dict),
    # which has a `body` key, that corresponds to the
    # `sqs.send_message` call from `routing.tasks`. Split that text on =,
    # and take the first element, which is the drive_time_query_id
    drive_time_query_id = int(event['drive_time_query'])

    print(f'[{datetime.now()}] main(): drive_time_query_id={drive_time_query_id}')

    success = get_nodes_and_make_polygon(drive_time_query_id)

    print(f'[{datetime.now()}] main(): Success? {success}. Way to go, slugger.')
    print(f'[{datetime.now()}] main() ran for {datetime.now()-start_time}')


if __name__ == "__main__":
    test_event = {
        'drive_time_query': 371
    }
    print(f'[{datetime.now()}] Calling main() from __main__')
    main(test_event, '')
