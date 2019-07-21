from rest_framework import generics

from bridges.models import NewYorkBridge
from bridges.serializers import NewYorkBridgeSerializer

class NewYorkBridgeList(generics.ListCreateAPIView):
    queryset = NewYorkBridge.objects.all().order_by('pk')
    serializer_class = NewYorkBridgeSerializer

class NewYorkBridgeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = NewYorkBridge.objects.all()
    serializer_class = NewYorkBridgeSerializer
