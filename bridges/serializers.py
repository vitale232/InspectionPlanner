from rest_framework_gis.serializers import GeoFeatureModelSerializer

from bridges.models import NewYorkBridge


class NewYorkBridgeSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = NewYorkBridge
        geo_field = 'the_geom'
        auto_bbox = True
        exclude = ['drive_time_queries', ]

