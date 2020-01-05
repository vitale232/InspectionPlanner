from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import filters
from rest_framework import generics
from rest_framework import status

from rest_framework_gis.filters import InBBoxFilter
from rest_framework.response import Response
from rest_framework.views import APIView

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

from bridges.models import NewYorkBridge
from bridges.serializers import NewYorkBridgeSerializer
from bridges.colormap import get_rgbs


class NewYorkBridgeList(generics.ListAPIView):
    queryset = NewYorkBridge.objects.all().order_by('pk')
    serializer_class = NewYorkBridgeSerializer
    bbox_filter_field = 'the_geom'
    filter_backends = (InBBoxFilter, filters.SearchFilter, DjangoFilterBackend, )
    search_fields = ('^common_name', )
    filterset_fields = ('bin', 'carried', 'county_name', )


class NewYorkBridgeDetail(generics.RetrieveAPIView):
    queryset = NewYorkBridge.objects.all()
    serializer_class = NewYorkBridgeSerializer


class NewYorkBridgeRandom(generics.ListAPIView):
    # Get 500 random bridges for zoomed out view
    queryset = NewYorkBridge.objects.order_by('?')[:500]
    serializer_class = NewYorkBridgeSerializer


class NewYorkBridgeDriveTime(generics.ListAPIView):
    serializer_class = NewYorkBridgeSerializer
    bbox_filter_field = 'the_geom'
    filter_backends = (InBBoxFilter, )

    def get_queryset(self):
        id_ = int(self.kwargs['id_'])
        return NewYorkBridge.objects.filter(drive_time_queries__contains=[id_]).order_by('bin')


class NewYorkBridgeColorMap(APIView):
    def get(self, request):
        bins = request.query_params.get('bins', '5')
        field = request.query_params.get('field', 'aadt')
        colormap = request.query_params.get('colormap', 'viridis')
        mode = request.query_params.get('mode', 'equalcount')

        payload = get_rgbs(
            int(bins),
            field,
            colormap=colormap,
            mode=mode
        )

        return Response(payload, status=status.HTTP_200_OK)
