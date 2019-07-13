from django.contrib.gis import admin
from .models import NewYorkBridge

admin.site.register(NewYorkBridge, admin.OSMGeoAdmin)
