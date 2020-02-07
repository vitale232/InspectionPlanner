import { columnFactory } from '@pebula/ngrid';

export const COLUMNS = columnFactory()
  .default({ width: '100px', resize: true, reorder: true})
  .table(
    { prop: 'zoom_to_icon', minWidth: 50, width: '50px', type: 'zoom_to_icon', pin: 'start', wontBudge: true, reorder: false, },
    { prop: 'bin',  id: 'bin', sort: true, label: 'BIN', },
    { prop: 'inspection', id: 'inspection', type: 'date', width: '112px', sort: true, label: 'Inspected Date', },
    { prop: 'region', id: 'region', type: 'region', sort: true, width: '65px', label: 'Region' },
    { prop: 'county_name', id: 'countyName', sort: true, width: '105px', label: 'County', },
    { prop: 'state_owned', id: 'stateOwned', sort: true, label: 'State Owned', },
    { prop: 'political_field', id: 'politicalField', sort: true, width: '105px', label: 'Municipality' },
    { prop: 'primary_owner', id: 'primaryOwner', sort: true, label: 'Owner', },
    { prop: 'primary_maintainer', id: 'primaryMaintainer', sort: true, label: 'Maintainer', },
    { prop: 'common_name', id: 'commonName', sort: true, width: '112px', label: 'Common Name', },
    { prop: 'gtms_structure', id: 'structure', width: '175px', sort: true, label: 'Span Structure', },
    { prop: 'gtms_material', id: 'materials', width: '175px', sort: true, label: 'Span Materials' },
    { prop: 'carried', id: 'carried', width: '175px', sort: true, label: 'Carried Feature', },
    { prop: 'crossed', id: 'crossed', width: '175px', sort: true, label: 'Crossed Feature', },
    { prop: 'crossed_mi', id: 'crossedMi', width: '100px', sort: true, label: 'Crossed Mi.' },
    { prop: 'crossed_to', id: 'crossedTo', width: '100px', sort: true, label: 'Crossed To', },
    { prop: 'location', id: 'location', sort: true, label: 'Location', },
    { prop: 'posted_leg', id: 'postedLeg', sort: true, label: 'Posted Leg', },
    { prop: 'other_post', id: 'otherPost', sort: true, label: 'Other Post', },
    { prop: 'aadt', id: 'aadt', type: 'aadt', sort: true, label: 'AADT', },
    { prop: 'year_built', id: 'yearBuilt', type: 'int', width: '110px', sort: true, label: 'Year Built', },
    { prop: 'condition_field', id: 'conRat', type: 'numberHundredths', width: '100px', sort: true, label: 'Condition Rating' },
    { prop: 'bridge_length', id: 'bridgeLength', type: 'numberHundredths', width: '100px', sort: true, label: 'Bridge Length' },
    { prop: 'curb_to_curb', id: 'curbToCurb', type: 'numberHundredths', width: '100px', sort: true, label: 'Curb to Curb', },
    { prop: 'deck_area_field', id: 'deckArea', type: 'numberHundredths', width: '100px', sort: true, label: 'Deck Area', },
    { prop: 'posted_load', id: 'postedLoad', type: 'int', sort: true, label: 'Posted Load' },
    { prop: 'restricted', id: 'restricted', type: 'int', sort: true, label: 'Restricted', },
    {
      prop: 'total_hz_c', id: 'horizontalClearance', type: 'numberHundredths',
      width: '135px', sort: true, label: 'Horizontal Clearance',
    },
    {
      prop: 'posted_vrt', id: 'verticalClearance', type: 'numberHundredths',
      width: '125px', sort: true, label: 'Vertical Clearance',
    },
    { prop: 'permitted_field', id: 'permittedField', type: 'numberHundredths', sort: true, label: 'Permitted', },
    { prop: 'latitude', id: 'latitude', sort: true,  type: 'latLon', width: '115px', label: 'Latitude' },
    { prop: 'longitude', id: 'longitude', sort: true, type: 'latLon', width: '115px', label: 'Longitude', },
  );
