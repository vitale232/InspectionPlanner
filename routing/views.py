from rest_framework import generics

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
