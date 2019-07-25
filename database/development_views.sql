create or replace view latest_drivetimequery as
    select * from routing_drivetimequery
    where routing_drivetimequery.id = (
        select max(routing_drivetimequery.id) from routing_drivetimequery
    );

CREATE OR REPLACE VIEW latest_drivetimenode AS
    SELECT * FROM routing_drivetimenode
    WHERE routing_drivetimenode.drive_time_query_id = (
        SELECT MAX(drive_time_query_id) FROM routing_drivetimenode
    );

CREATE OR REPLACE VIEW latest_drivetimepolygon AS
    SELECT * FROM routing_drivetimepolygon
        WHERE routing_drivetimepolygon.drive_time_query_id = (
        SELECT MAX(drive_time_query_id) FROM routing_drivetimepolygon
    );
