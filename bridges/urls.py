from django.urls import path

from routing.views import WaysList
from bridges.views import (
    NewYorkBridgeDetail, NewYorkBridgeList, NewYorkBridgeRandom
)


urlpatterns = [
    path('new-york-bridges/', NewYorkBridgeList.as_view(), name='new-york-bridge-list'),
    path('new-york-bridges-feeling-lucky/', NewYorkBridgeRandom.as_view(), name='new-york-bridge-feeling-lucky-list'),
    path('new-york-bridges/<int:pk>/', NewYorkBridgeDetail.as_view(), name='new-york-bridge-detail'),
]
