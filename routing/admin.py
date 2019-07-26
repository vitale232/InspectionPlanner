from django.contrib.gis import admin
from .models import Ways

admin.site.register(Ways, admin.OSMGeoAdmin)
