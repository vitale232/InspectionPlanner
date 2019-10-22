from datetime import datetime
import traceback

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
        existing_drive_time_query = DriveTimeQuery.objects.filter(
            place_id=place_id
        ).filter(
            drive_time_hours=drive_time_hours
        ).order_by(
            '-created_time'
        )[:1].get()
        allowed_fields = [field.name for field in DriveTimeQuery._meta.fields]
        model_data = {key: value for key, value in request_data.items() if key in allowed_fields}
        # Query is already cached in db. Exit.
        print(f'[{datetime.now()}] Early exit. {place_id} with drive_time_hours {drive_time_hours} exists.')
        return True
    except (DriveTimePolygon.DoesNotExist, DriveTimeQuery.DoesNotExist) as exc:
        print(f'[{datetime.now()}] Exception: {exc}')
        print(f'[{datetime.now()}] Generating new results')

    # Query the Ways table with the osm_id returned by Nominatim API
    # If it wasn't a way object, it won't exist. Instead use the lat/lon from
    # the nominatim response to build a buffer polygon and capture the
    # nearest Ways object. If the lat/lon is too far from a road
    # or outside of the routable area, there will be a 500 error
    # TODO: Use osm_class from nominatim to more efficiently handle osm_ids
    # from OSM types relation and node, and don't return 500 errors. This is
    # the least of our performace concerns, so not worth it yet
    try:
        print(f'[{datetime.now()}] finding way')
        way = Ways.objects.get(osm_id=osm_id)
    except (Ways.DoesNotExist, Ways.MultipleObjectsReturned) as exc:
        print(' not found')
        if not lat or not lon:
            raise exc
        nominatim_point = Point(float(lon), float(lat), srid=4326)
        print(f'[{datetime.now()}] nominatim point: {nominatim_point}')
        way = Ways.objects.filter(
            the_geom__intersects=nominatim_point.buffer(0.01)
        ).annotate(
            distance=Distance('the_geom', nominatim_point)
        ).order_by(
            'distance'
        )[:1].get()
        print(f'[{datetime.now()}]  generated way from distance: {way}')

    # Remove nominatim fields that are not modeled
    allowed_fields = [field.name for field in DriveTimeQuery._meta.fields]
    model_data = {key: value for key, value in request_data.items() if key in allowed_fields}
    print(allowed_fields)
    print(model_data)

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

    print(f'[{datetime.now()}] calling db func')
    drive_time = DriveTime(
        ways_vertices_pgr.id,
        drive_time_hours
    )
    print(f'[{datetime.now()}]  drive_time: {drive_time}')
    rows = drive_time.execute_sql()
    models = drive_time.to_models(drive_time_query=drive_time_query)
    DriveTimeNode.objects.bulk_create(models)

    drive_time_polygon = drive_time.to_polygon(
        alpha=30,
        drive_time_query=drive_time_query
    )
    if 'LINESTRING' in str(drive_time_polygon):
        DriveTimePolygon.objects.create(
            drive_time_query=drive_time_query,
            the_geom=drive_time_query.the_geom.buffer(0.05)
        )
    print(f'[{datetime.now()}] drive_time_polygon: {drive_time_polygon}')
    print(f'[{datetime.now()}] completed in {datetime.now()-start_time}')

    return True