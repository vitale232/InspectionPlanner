from rest_framework import generics

from bridges.models import NewYorkBridge
from bridges.serializers import NewYorkBridgeSerializer

class NewYorkBridgeList(generics.ListCreateAPIView):
    queryset = NewYorkBridge.objects.all().order_by('pk')
    serializer_class = NewYorkBridgeSerializer

class NewYorkBridgeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = NewYorkBridge.objects.all()
    serializer_class = NewYorkBridgeSerializer

class NewYorkBridgeRandom(generics.ListCreateAPIView):
    # Get 500 random bridges for zoomed out view
    queryset = NewYorkBridge.objects.order_by('?')[:500]
    serializer_class = NewYorkBridgeSerializer