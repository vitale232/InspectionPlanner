from django.contrib.postgres.fields import ArrayField, HStoreField
from django.db import models
import django.contrib.gis.db.models as gis_models


class Configuration(models.Model):
    def __str__(self):
        return f'{self.tag_key}: {self.tag_value}'

    tag_id = models.IntegerField(unique=True, blank=True, null=True)
    tag_key = models.TextField(blank=True, null=True)
    tag_value = models.TextField(blank=True, null=True)
    priority = models.FloatField(blank=True, null=True)
    maxspeed = models.FloatField(blank=True, null=True)
    maxspeed_forward = models.FloatField(blank=True, null=True)
    maxspeed_backward = models.FloatField(blank=True, null=True)
    force = models.CharField(max_length=1, blank=True, null=True)

    class Meta:
        db_table = 'configuration'


class OsmNodes(models.Model):
    def __str__(self):
        return str(self.osm_id)

    osm_id = models.BigIntegerField(primary_key=True)
    attributes = HStoreField(null=True)
    tags = HStoreField(null=True)
    tag_name = models.TextField(blank=True, null=True)
    tag_value = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    the_geom = gis_models.GeometryField(blank=True, null=True)

    class Meta:
        db_table = 'osm_nodes'


class OsmRelations(models.Model):
    def __str__(self):
        return str(self.osm_id)

    osm_id = models.BigIntegerField(primary_key=True)
    members = HStoreField(null=True)
    attributes = HStoreField(null=True)
    tags = HStoreField(null=True)
    tag_name = models.TextField(blank=True, null=True)
    tag_value = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'osm_relations'


class OsmWays(models.Model):
    def __str__(self):
        return str(self.osm_id)

    osm_id = models.BigIntegerField(primary_key=True)
    members = HStoreField(null=True)
    attributes = HStoreField(null=True)
    tags = HStoreField(null=True)
    tag_name = models.TextField(blank=True, null=True)
    tag_value = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    the_geom = gis_models.GeometryField(blank=True, null=True)

    class Meta:
        db_table = 'osm_ways'


class Pointsofinterest(models.Model):
    def __str__(self):
        return str(self.osm_id)

    pid = models.BigAutoField(primary_key=True)
    osm_id = models.BigIntegerField(unique=True, blank=True, null=True)
    vertex_id = models.BigIntegerField(blank=True, null=True)
    edge_id = models.BigIntegerField(blank=True, null=True)
    side = models.CharField(max_length=1, blank=True, null=True)
    fraction = models.FloatField(blank=True, null=True)
    length_m = models.FloatField(blank=True, null=True)
    attributes = HStoreField(null=True)
    tags = HStoreField(null=True)
    tag_name = models.TextField(blank=True, null=True)
    tag_value = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    the_geom = gis_models.GeometryField(blank=True, null=True)
    new_geom = gis_models.GeometryField(blank=True, null=True)

    class Meta:
        db_table = 'pointsofinterest'


class WaysVerticesPgr(models.Model):
    def __str__(self):
        return str(self.id)

    id = models.BigAutoField(primary_key=True)
    osm_id = models.BigIntegerField(unique=True, blank=True, null=True)
    eout = models.IntegerField(blank=True, null=True)
    lon = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    lat = models.DecimalField(max_digits=11, decimal_places=8, blank=True, null=True)
    cnt = models.IntegerField(blank=True, null=True)
    chk = models.IntegerField(blank=True, null=True)
    ein = models.IntegerField(blank=True, null=True)
    the_geom = gis_models.GeometryField(blank=True, null=True)

    class Meta:
        db_table = 'ways_vertices_pgr'
        managed = False


class Ways(models.Model):
    def __str__(self):
        return str(self.osm_id)

    gid = models.BigAutoField(primary_key=True)
    osm_id = models.BigIntegerField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    length_m = models.FloatField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    tag = models.ForeignKey(
        Configuration, models.DO_NOTHING,
        blank=True, null=True
    )
    source = models.ForeignKey(
        'WaysVerticesPgr', models.CASCADE,
        related_name='wayssource', db_column='source',
        blank=True, null=True
    )
    target = models.ForeignKey(
        'WaysVerticesPgr', models.CASCADE,
        related_name='waystarget', db_column='target',
        blank=True, null=True
    )
    source_osm = models.ForeignKey(
        'WaysVerticesPgr', models.CASCADE,
        related_name='wayssourceosm', db_column='source_osm',
        blank=True, null=True
    )
    target_osm = models.ForeignKey(
        'WaysVerticesPgr', models.CASCADE,
        related_name='waystargetosm', db_column='target_osm',
        blank=True, null=True
    )
    cost = models.FloatField(blank=True, null=True)
    reverse_cost = models.FloatField(blank=True, null=True)
    cost_s = models.FloatField(blank=True, null=True)
    reverse_cost_s = models.FloatField(blank=True, null=True)
    rule = models.TextField(blank=True, null=True)
    one_way = models.IntegerField(blank=True, null=True)
    oneway = models.TextField(blank=True, null=True)
    x1 = models.FloatField(blank=True, null=True)
    y1 = models.FloatField(blank=True, null=True)
    x2 = models.FloatField(blank=True, null=True)
    y2 = models.FloatField(blank=True, null=True)
    maxspeed_forward = models.FloatField(blank=True, null=True)
    maxspeed_backward = models.FloatField(blank=True, null=True)
    priority = models.FloatField(blank=True, null=True)
    the_geom = gis_models.GeometryField(blank=True, null=True)

    class Meta:
        db_table = 'ways'
        managed = False

class DriveTimeNode(models.Model):
    def __str__(self):
        return str(self.ways_vertex_pgr)

    ways_vertex_pgr = models.ForeignKey('WaysVerticesPgr', models.CASCADE)
    osm_id = models.BigIntegerField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    seq = models.BigIntegerField(blank=True, null=True)
    node = models.BigIntegerField(blank=True, null=True)
    edge = models.BigIntegerField(blank=True, null=True)
    cost = models.FloatField(blank=True, null=True)
    agg_cost = models.FloatField(blank=True, null=True)

    created_time = models.DateTimeField(auto_now_add=True)
    edited_time = models.DateTimeField(auto_now=True)

    the_geom = gis_models.GeometryField()

    query_id = models.ForeignKey('DriveTimeQuery', models.CASCADE, null=True)


class DriveTimeQuery(models.Model):
    def __str__(self):
        return str(self.place_id)

    search_text = models.CharField(blank=False, null=False, max_length=300)
    place_id = models.BigIntegerField(blank=True, null=True)
    osm_type = models.CharField(blank=True, null=True)
    osm_id = models.BigIntegerField(blank=True, null=True)
    bounding_box = ArrayField(models.FloatField(), size=4, null=True)
    lat = models.FloatField(null=True)
    lon = models.FloatField(null=True)
    display_name = models.CharField(blank=True, max_length=300)
    osm_class = models.CharField(blank=True, max_length=30)
    osm_type = models.CharField(blank=True, max_length=30)
    importance = models.FloatField(null=True)

    created_time = models.DateTimeField(auto_now_add=True)
    edited_time = models.DateTimeField(auto_now=True)

    the_geom = gis_models.GeometryField()
    ways_vertices_pgr_start_point = models.ForeignKey(
        'WaysVerticesPgr', models.CASCADE
    )


class DriveTimePolygon(models.Model):
    def __str__(self):
        return str(self.id)

    drive_time_query = models.ForeignKey('DriveTimeQuery', models.CASCADE)

    the_geom = gis_models.GeometryField()
