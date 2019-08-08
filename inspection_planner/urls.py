from django.contrib import admin
from django.urls import include, path
from rest_framework.urlpatterns import format_suffix_patterns

from routing.views import WaysList
from bridges.views import NewYorkBridgeDetail, NewYorkBridgeList


urlpatterns = [
    path('ways/', WaysList.as_view()),
    path('bridges/', include('bridges.urls')),
    path('routing/', include('routing.urls')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
