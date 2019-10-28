from datetime import datetime
import traceback

import boto3
from django.conf import settings
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point

from routing.models import (
    DriveTimeNode, DriveTimePolygon, DriveTimeQuery, Ways, WaysVerticesPgr,
)
from database.functions import DriveTime


def new_drive_time_query(request_data):
    start_time = datetime.now()
    # TODO: Double check for the drive-time-query to account for multiple identical requests
    # in the queue
    print(f'[{start_time}]: {request_data}')
    lon = request_data.get('lon', None)
    lat = request_data.get('lat', None)
    osm_id = request_data.get('osm_id', None)
    drive_time_hours = request_data.get('drive_time_hours', 0.25)
    inspection_years = request_data.get('inspection_years', 2)
    place_id = request_data['place_id']

    try:
        polygon_pending = False
        existing_drive_time_query = DriveTimeQuery.objects.filter(
            place_id=place_id
        ).filter(
            drive_time_hours=drive_time_hours
        ).order_by(
            '-created_time'
        )[:1].get()

        polygon_pending = existing_drive_time_query.polygon_pending

        drive_time_polygon = DriveTimePolygon.objects.filter(
            drive_time_query=existing_drive_time_query
        ).order_by(
            '-created_time'
        )[:1].get()
    except DriveTimeQuery.DoesNotExist as exc:
        print(f'[{datetime.now()}] Exception: {exc}')
        print(f'[{datetime.now()}] Generating new results')
    except DriveTimePolygon.DoesNotExist as exc:
        print(f'[{datetime.now()}] DriveTimeQuery {existing_drive_time_query.id}  polygon_pending: {polygon_pending}')
        if polygon_pending:
            print(f'[{datetime.now()}] Early exit. Polygon is in the queue, pending creation.')
            return True
        print(f'[{datetime.now()}] No polygon in the queue. Processing query.')
    else:
        print(f'[{datetime.now()}] Early exit. {place_id} with drive_time_hours {drive_time_hours} exists.')
        return True

    # Query the Ways table with the osm_id returned by Nominatim API
    # If it wasn't a way object, it won't exist. Instead use the lat/lon from
    # the nominatim response to build a buffer polygon and capture the
    # nearest Ways object. If the lat/lon is too far from a road
    # or outside of the routable area, there will be a 500 error
    # TODO: Use osm_class from nominatim to more efficiently handle osm_ids
    # from OSM types relation and node, and don't return 500 errors. This is
    # the least of our performace concerns, so not worth it yet
    try:
        no_way = False
        print(f'[{datetime.now()}] finding way')
        way = Ways.objects.get(osm_id=osm_id)
    except (Ways.DoesNotExist, Ways.MultipleObjectsReturned) as exc:
        print(f'[{datetime.now()}]  not found')
        if not lat or not lon:
            raise exc
        nominatim_point = Point(float(lon), float(lat), srid=4326)
        print(f'[{datetime.now()}] nominatim point: {nominatim_point}')
        try:
            way = Ways.objects.filter(
                the_geom__intersects=nominatim_point.buffer(0.01)
            ).annotate(
                distance=Distance('the_geom', nominatim_point)
            ).order_by(
                'distance'
            )[:1].get()
            print(f'[{datetime.now()}]  generated way from distance: {way}')
        except:
            no_way = True
            pass
    
    # Remove nominatim fields that are not modeled
    allowed_fields = [field.name for field in DriveTimeQuery._meta.fields]
    model_data = {key: value for key, value in request_data.items() if key in allowed_fields}

    if no_way:
        ways_vertices_pgr = None
    else:
        ways_vertices_pgr = WaysVerticesPgr.objects.get(
            id=way.source.pk
        )
        print(f'[{datetime.now()}] ways_vertices_pgr: {ways_vertices_pgr}')

    drive_time_query = DriveTimeQuery.objects.create(
        **model_data,
        ways_vertices_pgr_source=ways_vertices_pgr
    )
    print(f'[{datetime.now()}] drive_time_query: {drive_time_query}')
    drive_time_query.save()

    if no_way:
        return True

    print(f'[{datetime.now()}] calling db func')
    drive_time = DriveTime(
        ways_vertices_pgr.id,
        drive_time_hours
    )
    print(f'[{datetime.now()}]  drive_time: {drive_time}')
    drive_time.execute_sql()
    DriveTimeNode.objects.bulk_create(
        drive_time.to_models(drive_time_query=drive_time_query)
    )

    drive_time_query.polygon_pending = True
    drive_time_query.save()

    print(
        f'[{datetime.now()}] Set DriveTimeQuery.pending_' +
        f'polygon to: {drive_time_query.polygon_pending}'
    )

    print(f'[{datetime.now()}] SQS_URL: {settings.SQS_URL}')
    sqs = boto3.client('sqs')
    response = sqs.send_message(
        QueueUrl=settings.SQS_URL,
        DelaySeconds=5,
        MessageBody=f'drive_time_query_id={drive_time_query.id}'
    )

    message_id = response['MessageId']
    print(f'[{datetime.now()}] Message sent to lambda with id {message_id}')
    print(f'[{datetime.now()}] completed in {datetime.now()-start_time}')

    return True
