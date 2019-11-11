from datetime import datetime
import os
import urllib.parse
import time

from django.contrib.gis.utils import LayerMapping
from sqlalchemy import create_engine, func, MetaData, update
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import MultipleResultsFound
import geoalchemy2
from geoalchemy2.shape import to_shape

from .models import NewYorkBridge
from routing.models import DriveTimeQuery

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

def db_url_from_env():
    # Read the lambda env file to construct a database URL
    env_path = os.path.abspath(os.path.join(
        os.path.abspath(os.path.basename(__file__)),
        '..',
        'lambda-drive-time-polygons',
        '.lambda-env'
    ))
    print(f'[{datetime.now()}] db_url_from_env() Reading env file: {env_path}')
    with open(env_path, 'r') as env_file:
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

def update_bridges_with_dtq_id(skip_list=[]):
    start_time = datetime.now()
    print(f'[{datetime.now()}] update_bridges_with_dtq_id(): Setting up sqlalchemy')
    engine = create_engine(db_url_from_env(), echo=False)
    session = Session(engine)

    metadata = MetaData()

    metadata.reflect(engine, only=['routing_drivetimenode', 'routing_drivetimepolygon', 'bridges_newyorkbridge'])

    Base = automap_base(metadata=metadata)
    Base.prepare()

    DriveTimeNode = Base.classes.routing_drivetimenode
    DriveTimePolygon = Base.classes.routing_drivetimepolygon
    DriveTimeQuery = Base.classes.routing_drivetimequery
    WaysVerticesPgr = Base.classes.ways_vertices_pgr
    NewYorkBridge = Base.classes.bridges_newyorkbridge

    drive_time_queries = session.query(DriveTimeQuery).all()
    print(f'[{datetime.now()}] update_bridges_with_dtq_id(): Processing {len(drive_time_queries)} DTQs')

    skipped, multiple_results = [], []
    for drive_time_query in drive_time_queries:
        drive_time_query_id = drive_time_query.id
        if drive_time_query_id in skip_list:
            # skipped.append([drive_time_query_id])
            print(f'[{datetime.now()}] Skipping {drive_time_query_id} because it\'s in skip_list\n')
            continue
        print(f'[{datetime.now()}] DriveTimeQuery.id : {drive_time_query.id}')
        print(f'[{datetime.now()}] Display name      : {drive_time_query.display_name}')
        print(f'[{datetime.now()}] Search text       : {drive_time_query.search_text}')
        print(f'[{datetime.now()}] Drive time hours  : {drive_time_query.drive_time_hours}')

        drive_time_polygon = session.query(DriveTimePolygon).filter_by(
            drive_time_query_id=drive_time_query_id
        ).first()

        if drive_time_polygon:
            print(f'[{datetime.now()}] DriveTimePolygon.id == {drive_time_polygon.id}')
        else:
            print(f'[{datetime.now()}] DriveTimePolygon == {drive_time_polygon}')
            print(f'[{datetime.now()}] No DriveTimePolygon!!!!! Skipping\n')
            skipped.append(drive_time_query_id)
            continue

        try:
            polygon = to_shape(
                session.query(DriveTimePolygon.the_geom).filter_by(
                    drive_time_query_id=drive_time_query_id
                ).scalar()
            )
        except MultipleResultsFound:
            skipped.append(drive_time_query_id)
            multiple_results.append(drive_time_query_id)
            print(f'[{datetime.now()}] Multiple results found!!!!! Skipping.\n')
            continue

        # print(f'[{datetime.now()}] Running intersect query on NewYorkBridge objects')
        # bridges = session.query(NewYorkBridge).filter(
        #     NewYorkBridge.the_geom.ST_Intersects('SRID=4326;'+polygon.buffer(0.005).wkt)
        # ).all()
        # print(f'[{datetime.now()}] Iterating through {len(bridges)} bridges')
        # for b in bridges:
        #     bridge = session.query(NewYorkBridge).filter(NewYorkBridge.id == b.id).first()
        #     drive_time_queries = bridge.drive_time_queries
        #     bridge.drive_time_queries = list(set(drive_time_queries + [drive_time_query_id]))
        #     session.add(bridge)
        # print(f'[{datetime.now()}] Committing bridges to db')
        # session.flush()
        # session.commit()
        # print('')
    # session.flush()
    # session.commit()
    if skipped:
        print(f'[{datetime.now()}] Skipped drive_time_queries: {skipped}')
    if multiple_results:
        print(f'[{datetime.now()}] Multiple results found for: {multiple_results}')
    print(f'[{datetime.now()}] Script complete in {datetime.now()-start_time}')

    return drive_time_query
