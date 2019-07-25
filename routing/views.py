from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import requests

from database.functions import DriveTime
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
    queryset = DriveTimeQuery.objects.all()
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

class QueryDriveTime(APIView):
    def get(self, request, format=None):
        # If a general query string is provided, null out other search parameters
        # If detailed parameters are provided, null out the q param
        if request.query_params.get('q', None):
            query = request.query_params.get('q', None)
            street = None
            city = None
            state = None
            country = None
        else:
            query = None
            street = request.query_params.get('street', None)
            city = request.query_params.get('city', None)
            state = request.query_params.get('state', 'NY')
            country = request.query_params.get('country', 'USA')

        # If the desired drive time is not specified, default to 15 mins.
        drive_time_hours = request.query_params.get('drive_time', 0.25)
        params = {
            'q': query,
            'street': street,
            'city': city,
            'state': state,
            'country': country,
            'format': 'json',
        }
        from pprint import pprint
        pprint(params)

        nominatim_request = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params=params
        )
        if nominatim_request.status_code == 200:
            try:
                data = nominatim_request.json()[0]
            except IndexError:
                return Response(
                    {'msg': 'No results found for this address'},
                    status=status.HTTP_404_NOT_FOUND
                )
            data.pop('licence', None)
            data['bounding_box'] = data.pop('boundingbox', None)
            data['osm_class'] = data.pop('class', None)
            data['osm_type'] = data.pop('type', None)
            lon = data.get('lon', None)
            lat = data.get('lat', None)
            data['the_geom'] = f'POINT({lon} {lat})'
            osm_id = data.get('osm_id', None)
            try:
                way = Ways.objects.get(osm_id=osm_id)
            except Ways.DoesNotExist as exc:
                if not lat or not lon:
                    raise exc
                point = Point(float(lon), float(lat), srid=4326)
                way = Ways.objects.filter(
                    the_geom__intersects=point.buffer(0.005)
                ).annotate(
                    distance=Distance('the_geom', point)
                ).order_by('distance').first()
                
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

            drive_time_polygon = drive_time.to_polygon(
                alpha=30,
                drive_time_query=drive_time_query
            )
            response_data = DriveTimePolygonSerializer(drive_time_polygon)
            return Response(response_data.data, status=status.HTTP_200_OK)

        print(nominatim_request)
        pprint(nominatim_request.json())
        json_data = nominatim_request.json()

        return Response(json_data, status=status.HTTP_400_BAD_REQUEST)
