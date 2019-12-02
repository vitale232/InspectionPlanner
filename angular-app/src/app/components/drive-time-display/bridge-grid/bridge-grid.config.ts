import { columnFactory } from '@pebula/ngrid';

export const COLUMNS = columnFactory()
  .table(
    // { prop: 'id', sort: true, },
    { prop: 'properties.inspection', sort: true, label: 'Inspected Date' },
    { prop: 'properties.bin', sort: true, label: 'BIN', },
    { prop: 'properties.county_name', sort: true, label: 'County', },
    { prop: 'properties.primary_owner', sort: true, label: 'Owner' },
    { prop: 'properties.gtms_structure', sort: true, label: 'Span Structure' },
    { prop: 'properties.gtms_mater', sort: true, label: 'Span Materials' },
    { prop: 'properties.aadt', sort: true, label: 'AADT' },
  )
  .header(
    // { rowClassName: 'pbl-groupby-row' },
    { id: 'pbl-groupby-row', type: 'pbl-groupby-row', label: ' ' },
    );
