from rest_framework_gis.serializers import GeoFeatureModelSerializer

from routing.models import (
    DriveTimeNode, DriveTimePolygon, DriveTimeQuery,
    Ways, WaysVerticesPgr
)

class DriveTimeNodeSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = DriveTimeNode
        geo_field = 'the_geom'
        fields = '__all__'


class DriveTimePolygonSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = DriveTimePolygon
        geo_field = 'the_geom'
        fields = '__all__'


class DriveTimeQuerySerializer(GeoFeatureModelSerializer):
    class Meta:
        model = DriveTimeQuery
        geo_field = 'the_geom'
        fields = '__all__'


class WaysSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Ways
        geo_field = 'the_geom'
        fields = '__all__'


class WaysVerticesPgrSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = WaysVerticesPgr
        geo_field = 'the_geom'
        fields = '__all__'
