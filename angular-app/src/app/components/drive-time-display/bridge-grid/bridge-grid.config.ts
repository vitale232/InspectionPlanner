import { columnFactory } from '@pebula/ngrid';

export const COLUMNS = columnFactory()
  .default({ width: '75px', resize: true, reorder: true})
  .table(
    { prop: 'zoom_to_icon', minWidth: 50, width: '50px', type: 'zoom_to_icon', pin: 'start', wontBudge: true, reorder: false, },
    { prop: 'properties.bin',  id: 'bin', sort: true, label: 'BIN', },
    { prop: 'properties.inspection', id: 'inspection', width: '120px', sort: true, label: 'Inspected Date', },
    { prop: 'properties.common_name', id: 'commonName', sort: true, width: '150px', label: 'Common Name', },
    { prop: 'properties.county_name', id: 'countyName', sort: true, width: '105px', label: 'County', },
    { prop: 'properties.primary_owner', id: 'primaryOwner', sort: true, label: 'Owner', },
    { prop: 'properties.gtms_structure', id: 'structure', width: '175px', sort: true, label: 'Span Structure', },
    { prop: 'properties.gtms_mater', id: 'materials', width: '175px', sort: true, label: 'Span Materials' },
    { prop: 'properties.carried', id: 'carried', width: '175px', sort: true, label: 'Carried Roadway', },
    { prop: 'properties.crossed', id: 'crossed', width: '175px', sort: true, label: 'Crossed Roadway', },
    { prop: 'properties.aadt', id: 'aadt', sort: true, label: 'AADT', },
    { prop: 'properties.year_built', id: 'yearBuilt', width: '110px', sort: true, label: 'Year Built', },
    { prop: 'properties.condition_field', id: 'conditionRating', sort: true, label: 'Condition Rating', }
  );
