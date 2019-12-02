import { columnFactory } from '@pebula/ngrid';

export const COLUMNS = columnFactory()
  .default({ width: '75px', resize: true, reorder: true})
  .table(
    { prop: 'id', sort: true, },
    { prop: 'properties.inspection', id: 'inspection', sort: true, label: 'Inspected Date' },
    { prop: 'properties.bin', id: 'bin', sort: true, label: 'BIN', },
    { prop: 'properties.county_name', id: 'countyName', sort: true, label: 'County', },
    { prop: 'properties.primary_owner', id: 'primaryOwner', sort: true, label: 'Owner' },
    { prop: 'properties.gtms_structure', id: 'structure', sort: true, label: 'Span Structure' },
    { prop: 'properties.gtms_mater', id: 'materials', sort: true, label: 'Span Materials' },
    { prop: 'properties.aadt', id: 'aadt', sort: true, label: 'AADT' },
  );
  // .header(
  //   { rowClassName: 'pbl-groupby-row' },
  //   { id: 'pbl-groupby-row', type: 'pbl-groupby-row', label: 'ACE' },
  // );
