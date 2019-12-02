import { columnFactory } from '@pebula/ngrid';

export const COLUMNS = columnFactory()
  .default({ width: '75px', resize: true, reorder: true})
  .table(
    { prop: 'properties.bin', pIndex: true,  id: 'bin', sort: true, label: 'BIN', },
    { prop: 'properties.inspection', id: 'inspection', sort: true, label: 'Inspected Date' },
    { prop: 'properties.common_name', id: 'commonName', sort: true, label: 'Common Name', },
    { prop: 'properties.county_name', id: 'countyName', sort: true, label: 'County', },
    { prop: 'properties.primary_owner', id: 'primaryOwner', sort: true, label: 'Owner' },
    { prop: 'properties.gtms_structure', id: 'structure', sort: true, label: 'Span Structure' },
    { prop: 'properties.gtms_mater', id: 'materials', sort: true, label: 'Span Materials' },
    { prop: 'properties.carried', id: 'carried', sort: true, label: 'Carried Roadway' },
    { prop: 'properties.crossed', id: 'crossed', sort: true, label: 'Crossed Roadway' },
    { prop: 'properties.aadt', id: 'aadt', sort: true, label: 'AADT' },
    { prop: 'properties.year_built', id: 'yearBuilt', sort: true, label: 'Year Built' },
    { prop: 'properties.condition_field', id: 'conditionRating', sort: true, label: 'Condition Rating', }
  );
