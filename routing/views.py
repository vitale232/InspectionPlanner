import datetime
from dateutil.relativedelta import relativedelta

from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django_q.tasks import async_task
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
from routing.tasks import new_drive_time_query

class DriveTimeNodeList(generics.ListAPIView):
    queryset = DriveTimeNode.objects.all()
    serializer_class = DriveTimeNodeSerializer


class DriveTimeNodeDetail(generics.RetrieveAPIView):
    queryset = DriveTimeNode.objects.all()
    serializer_class = DriveTimeNodeSerializer


class DriveTimePolygonList(generics.ListAPIView):
    queryset = DriveTimePolygon.objects.all()
    serializer_class = DriveTimePolygonSerializer


class DriveTimePolygonDetail(generics.RetrieveAPIView):
    queryset = DriveTimePolygon.objects.all()
    serializer_class = DriveTimePolygonSerializer


class DriveTimeQueryList(generics.ListAPIView):
    queryset = DriveTimeQuery.objects.all().order_by('-created_time')
    serializer_class = DriveTimeQuerySerializer


class DriveTimeQueryDetail(generics.RetrieveAPIView):
    queryset = DriveTimeQuery.objects.all()
    serializer_class = DriveTimeQuerySerializer


class WaysList(generics.ListAPIView):
    queryset =  Ways.objects.all()
    serializer_class = WaysSerializer


class WaysDetail(generics.RetrieveAPIView):
    queryset =  Ways.objects.all()
    serializer_class = WaysSerializer


class WaysVerticesPgrList(generics.ListAPIView):
    queryset = WaysVerticesPgr.objects.all()
    serializer_class = WaysVerticesPgrSerializer


class WaysVerticesPgrDetail(generics.RetrieveAPIView):
    queryset = WaysVerticesPgr.objects.all()
    serializer_class = WaysVerticesPgrSerializer


class QueryDriveTime(APIView, DriveTimePaginationMixin):
    pagination_class = GeoJsonPagination

    def paginate_queryset(self, queryset, request, view=None):
        paginate_response = self.resolve_boolean_param(request, 'paginate_response', True)
        if paginate_response:
            return super().paginate_queryset(queryset)
        else:
            return None

    def resolve_boolean_param(self, request, param_name, default=False):
        param = request.query_params.get(param_name, default)

        if isinstance(param, str):
            if param.lower() in ['true', 't', '1']:
                return True
            else:
                return False
        if isinstance(param, int):
            if param == 1:
                return True
            else:
                return False
        if isinstance(param, bool):
            return param
        
        # Fall back to default value if not string, int, or boolean
        return default

    def get(self, request, format=None):
        print(f'[{datetime.datetime.now()}] Start QueryDriveTime.get()')
        return_bridges = self.resolve_boolean_param(request, 'return_bridges', False)
        print(f'[{datetime.datetime.now()}] return_bridges={return_bridges}')

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
        # If the inspection_years is not specified, default to 2 years.
        drive_time_hours = request.query_params.get('drive_time_hours', 0.25)
        inspection_years = request.query_params.get('inspection_years', 2)
        if isinstance(inspection_years, str):
            try:
                inspection_years = int(inspection_years)
            except ValueError:
                inspection_years = 2
        inspection_date = datetime.datetime.now() - relativedelta(years=inspection_years)

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
                ).filter(
                    drive_time_hours=drive_time_hours
                ).order_by(
                    '-created_time'
                )[:1].get()
                print(f'[{datetime.datetime.now()}] existing_drive_time_query: {existing_drive_time_query}')

                drive_time_polygon = DriveTimePolygon.objects.filter(
                    drive_time_query=existing_drive_time_query
                ).order_by(
                    '-created_time'
                )[:1].get()

                drive_time_query = existing_drive_time_query
                print(f'[{datetime.datetime.now()}] Using cached results')

            except (DriveTimePolygon.DoesNotExist, DriveTimeQuery.DoesNotExist) as exc:
                print(f'[{datetime.datetime.now()}] {str(exc)}: Calculating new drive-time')
                existing_drive_time_query = None

            if not existing_drive_time_query:
                lon = data.get('lon', None)
                lat = data.get('lat', None)
                data.pop('licence', None)
                data['drive_time_hours'] = drive_time_hours
                data['bounding_box'] = data.pop('boundingbox', None)
                data['osm_class'] = data.pop('class', None)
                data['osm_type'] = data.pop('type', None)
                data['the_geom'] = f'POINT({lon} {lat})'
                data['search_text'] = query
                data['place_id'] = place_id

                # new_drive_time_query.delay(data)
                task_id = async_task(new_drive_time_query, data)
                print(f'[{datetime.datetime.now()}] task_id: {task_id}')

                accepted_payload = {
                    'msg': 'The request has been added to the queue',
                    'search_text': query,
                    'drive_time_hours': drive_time_hours,
                    'return_bridges': return_bridges,
                    'inspection_years': inspection_years,
                    'lat': data['lat'],
                    'lon': data['lon'],
                    'display_name': data['display_name']
                }
                return Response(accepted_payload, status=status.HTTP_202_ACCEPTED)

            if not return_bridges:
                dtq_serializer = DriveTimeQuerySerializer(drive_time_query)
                return Response(dtq_serializer.data, status=status.HTTP_200_OK)
            try:
                bridges = NewYorkBridge.objects.filter(
                    the_geom__intersects=drive_time_polygon.the_geom
                ).filter(
                    inspection__lte=inspection_date
                ).order_by(
                    'bin'
                )
            except AttributeError:
                # TODO: return drive time query here for development
                dtq_serializer = DriveTimeQuerySerializer(drive_time_query)
                return Response(dtq_serializer.data, status=status.HTTP_400_BAD_REQUEST)

            response_bridges = self.paginate_queryset(bridges, request, view=QueryDriveTime)
            if not response_bridges:
                response_bridges = bridges
            if response_bridges is not None:
                bridges_serializer = NewYorkBridgeSerializer(response_bridges, many=True)
                print(f'[{datetime.datetime.now()}] Bridges returned')
                return Response(bridges_serializer.data, status=status.HTTP_200_OK)

            polygon_serializer = DriveTimePolygonSerializer(drive_time_polygon)
            print(f'[{datetime.datetime.now()}] Polygon returned')
            return Response(polygon_serializer.data, status=status.HTTP_200_OK)

        json_data = nominatim_request.json()
        print(f'[{datetime.datetime.now()}] 400 returned')
        return Response(json_data, status=status.HTTP_400_BAD_REQUEST)
