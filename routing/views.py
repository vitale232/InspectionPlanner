from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_gis.pagination import GeoJsonPagination
import requests

from database.functions import DriveTime
from bridges.models import NewYorkBridge
from bridges.serializers import NewYorkBridgeSerializer
from routing.paginator import DriveTimePaginationMixin
from routing.models import (
    DriveTimeNode, DriveTimePolygon, DriveTimeQuery,
    Ways, WaysVerticesPgr
)
from routing.serializers import (
    DriveTimeNodeSerializer, DriveTimePolygonSerializer,
    DriveTimeQuerySerializer, WaysSerializer,
    WaysVerticesPgrSerializer
)

class DriveTimeNodeList(generics.ListCreateAPIView):
    queryset = DriveTimeNode.objects.all()
    serializer_class = DriveTimeNodeSerializer

class DriveTimeNodeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DriveTimeNode.objects.all()
    serializer_class = DriveTimeNodeSerializer

class DriveTimePolygonList(generics.ListCreateAPIView):
    queryset = DriveTimePolygon.objects.all()
    serializer_class = DriveTimePolygonSerializer

class DriveTimePolygonDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DriveTimePolygon.objects.all()
    serializer_class = DriveTimePolygonSerializer

class DriveTimeQueryList(generics.ListCreateAPIView):
    queryset = DriveTimeQuery.objects.all().order_by('-created_time')
    serializer_class = DriveTimeQuerySerializer

class DriveTimeQueryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DriveTimeQuery.objects.all()
    serializer_class = DriveTimeQuerySerializer

class WaysList(generics.ListCreateAPIView):
    queryset =  Ways.objects.all()
    serializer_class = WaysSerializer

class WaysDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset =  Ways.objects.all()
    serializer_class = WaysSerializer

class WaysVerticesPgrList(generics.ListCreateAPIView):
    queryset = WaysVerticesPgr.objects.all()
    serializer_class = WaysVerticesPgrSerializer

class WaysVerticesPgrDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = WaysVerticesPgr.objects.all()
    serializer_class = WaysVerticesPgrSerializer

class QueryDriveTime(APIView, DriveTimePaginationMixin):
    pagination_class = GeoJsonPagination

    def get(self, request, format=None):
        return_bridges = bool(request.query_params.get('return_bridges', 'false'))
        if return_bridges == 'true' or return_bridges is True:
            return_bridges = True
        else:
            return_bridges = False

        # If a general query string is provided, null out other search parameters
        # If detailed parameters are provided, null out the q param
        if request.query_params.get('q', None):
            query = request.query_params.get('q', None)
            street = None
            city = None
            state = None
            country = None
            search_text = query
        else:
            query = None
            street = request.query_params.get('street', None)
            city = request.query_params.get('city', None)
            state = request.query_params.get('state', 'NY')
            country = request.query_params.get('country', 'USA')
            search_text = ', '.join([street, city, state, country])

        # If the desired drive time is not specified, default to 15 mins.
        drive_time_hours = request.query_params.get('drive_time', 0.25)
        nominatim_query_params = {
            'q': query,
            'street': street,
            'city': city,
            'state': state,
            'country': country,
            'format': 'json',
        }

        nominatim_request = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params=nominatim_query_params
        )
        if nominatim_request.status_code == 200:
            try:
                data = nominatim_request.json()[0]
            except IndexError:
                return Response(
                    {'msg': 'No OSM results found for this address'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check for previous searches on this address. If exists, reuse the objects
            place_id = data['place_id']
            try:
                existing_drive_time_query = DriveTimeQuery.objects.filter(
                    place_id=place_id
                ).order_by(
                    '-created_time'
                )[:1].get()
                drive_time_polygon = DriveTimePolygon.objects.filter(
                    drive_time_query=existing_drive_time_query
                ).order_by(
                    '-created_time'
                )[:1].get()
                print(f'found drive_time_polygon: {drive_time_polygon}')
                drive_time_query = existing_drive_time_query
            except (DriveTimePolygon.DoesNotExist, DriveTimeQuery.DoesNotExist):
                existing_drive_time_query = None

            if not existing_drive_time_query:
                data.pop('licence', None)
                data['bounding_box'] = data.pop('boundingbox', None)
                data['osm_class'] = data.pop('class', None)
                data['osm_type'] = data.pop('type', None)
                lon = data.get('lon', None)
                lat = data.get('lat', None)
                data['the_geom'] = f'POINT({lon} {lat})'
                data['search_text'] = query
                osm_id = data.get('osm_id', None)
                # Remove nominatim fields that are not modeled
                allowed_fields = [field.name for field in DriveTimeQuery._meta.fields]
                data = {key: value for key, value in data.items() if key in allowed_fields}
                from pprint import pprint
                pprint(data)
                # Query the Ways table with the osm_id returned by Nominatim API
                # If it wasn't a way object, it won't exist. Instead use the lat/lon from
                # the nominatim response to build a buffer polygon and capture the
                # nearest Ways object. If the lat/lon is too far from a road
                # or outside of the routable area, there will be a 500 error
                # TODO: Use osm_class from nominatim to more efficiently handle osm_ids
                # from OSM types relation and node, and don't return 500 errors. This is
                # the least of our performace concerns, so not worth it yet
                try:
                    way = Ways.objects.get(osm_id=osm_id)
                except (Ways.DoesNotExist, Ways.MultipleObjectsReturned) as exc:
                    if not lat or not lon:
                        raise exc
                    nominatim_point = Point(float(lon), float(lat), srid=4326)
                    way = Ways.objects.filter(
                        the_geom__intersects=nominatim_point.buffer(0.01)
                    ).annotate(
                        distance=Distance('the_geom', nominatim_point)
                    ).order_by(
                        'distance'
                    )[:1].get()
                    print(f'way gid: {way.gid}')
                    print(f'way osm_id: {way.osm_id}')
                    # print(f'ways tag: {way.tag}')
                    
                ways_vertices_pgr = WaysVerticesPgr.objects.get(
                    id=way.source.pk
                )
                drive_time_query = DriveTimeQuery.objects.create(
                    **data,
                    ways_vertices_pgr_source=ways_vertices_pgr
                )
                drive_time_query.save()

                drive_time = DriveTime(
                    ways_vertices_pgr.id,
                    drive_time_hours
                )
                rows = drive_time.execute_sql()
                models = drive_time.to_models(drive_time_query=drive_time_query)
                DriveTimeNode.objects.bulk_create(models)
                print(f'len(models): {len(models)}')
                print('computing drive time polygon')
                drive_time_polygon = drive_time.to_polygon(
                    alpha=30,
                    drive_time_query=drive_time_query
                )
            if not return_bridges:
                serializer = DriveTimePolygonSerializer(drive_time_polygon)
            else:
                try:
                    bridges = NewYorkBridge.objects.filter(
                        the_geom__intersects=drive_time_polygon.the_geom
                    ).order_by(
                        'bin'
                    )
                except AttributeError:
                    # TODO: return drive time query here for development
                    # return Response()
                    serializer = DriveTimeQuerySerializer(drive_time_query)
                    print('oops')
                    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
                paginated_bridges = self.paginate_queryset(bridges)
                if paginated_bridges is not None:
                    serializer = NewYorkBridgeSerializer(paginated_bridges, many=True)
                    return self.get_paginated_response(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)

        json_data = nominatim_request.json()
        return Response(json_data, status=status.HTTP_400_BAD_REQUEST)
