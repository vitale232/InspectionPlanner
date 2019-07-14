CREATE OR REPLACE FUNCTION pgr_driveTime (node_id int, max_drive_time float) 
   RETURNS TABLE (
      id bigint,
      osm_id bigint,
      lon numeric(11,8),
      lat numeric(11,8),
      the_geom geometry(GEOMETRY,4326),
      seq integer,
      node bigint,
      edge bigint,
      cost double precision,
      agg_cost double precision 
      ) 
AS $$
BEGIN
   RETURN QUERY WITH DD AS (
  SELECT * FROM pgr_drivingDistance(
    'SELECT gid as id, source, target, cost FROM ways',
     node_id, max_drive_time
  )
)
SELECT w.id, w.osm_id, w.lon, w.lat, w.the_geom, d.seq, d.node, d.edge, d.cost, d.agg_cost
FROM ways_vertices_pgr w, DD d
WHERE w.id = d.node;
END; $$ 
LANGUAGE 'plpgsql';
