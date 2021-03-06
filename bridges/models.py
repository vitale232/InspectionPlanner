from django.contrib.gis.db import models
from django.contrib.postgres.fields import ArrayField


class NewYorkBridge(models.Model):
    def __str__(self):
        return self.bin

    bin = models.CharField(max_length=100)
    common_name = models.CharField(blank=True, max_length=100)
    local_bridge = models.CharField(blank=True, max_length=25)
    region = models.CharField(blank=True, max_length=10)
    county_name = models.CharField(blank=True, max_length=254)
    political_field = models.CharField(blank=True, max_length=100)
    carried = models.CharField(blank=True, max_length=50)
    crossed = models.CharField(blank=True, max_length=50)
    crossed_mi = models.CharField(blank=True, max_length=50)
    crossed_to = models.CharField(blank=True, max_length=50)
    location = models.CharField(blank=True, max_length=25)
    latitude = models.FloatField()
    longitude = models.FloatField()
    primary_owner = models.CharField(max_length=100)
    primary_maintainer = models.CharField(max_length=100)
    condition_field = models.FloatField()
    inspection = models.DateField(null=True)
    bridge_length = models.FloatField()
    curb_to_curb = models.FloatField()
    deck_area_field = models.FloatField()
    aadt = models.FloatField()
    year_of_aadt = models.IntegerField()
    gtms_material = models.CharField(blank=True, max_length=100)
    gtms_structure = models.CharField(blank=True, max_length=100)
    year_built = models.IntegerField()
    posted_load = models.FloatField()
    restricted = models.FloatField()
    r_posted = models.CharField(blank=True, max_length=3)
    other = models.FloatField()
    other_post = models.CharField(blank=True, max_length=111)
    posted_leg = models.CharField(blank=True, max_length=1)
    posting_co = models.FloatField()
    total_hz_c = models.FloatField()
    total_hz_1 = models.FloatField()
    posted_vrt = models.FloatField()
    posted_v_1 = models.FloatField()
    state_owned = models.CharField(blank=True, max_length=3)
    permitted_field = models.FloatField()
    permitted_1 = models.FloatField()
    carried_la = models.CharField(blank=True, max_length=134)

    created_time = models.DateTimeField(auto_now_add=True)
    edited_time = models.DateTimeField(auto_now=True)

    the_geom = models.PointField(srid=4326)

    drive_time_queries = ArrayField(models.IntegerField(), default=list)
