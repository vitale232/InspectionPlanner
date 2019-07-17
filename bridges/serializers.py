from rest_framework_gis.serializers import GeoFeatureModelSerializer

from bridges.models import NewYorkBridge


class NewYorkBridgeSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = NewYorkBridge
        geo_field = 'the_geom'
        fields = '__all__'
