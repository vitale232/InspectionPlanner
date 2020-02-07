import { columnFactory } from '@pebula/ngrid';

export const COLUMNS = columnFactory()
  .default({ width: '100px', resize: true, reorder: true})
  .table(
    { prop: 'zoom_to_icon', minWidth: 50, width: '50px', type: 'zoom_to_icon', pin: 'start', wontBudge: true, reorder: false, },
    { prop: 'properties.bin',  id: 'bin', sort: true, label: 'BIN', },
    { prop: 'properties.inspection', id: 'inspection', type: 'date', width: '112px', sort: true, label: 'Inspected Date', },
    { prop: 'properties.region', id: 'region', type: 'region', sort: true, width: '65px', label: 'Region' },
    { prop: 'properties.county_name', id: 'countyName', sort: true, width: '105px', label: 'County', },
    { prop: 'properties.state_owned', id: 'stateOwned', sort: true, label: 'State Owned', },
    { prop: 'properties.political_field', id: 'politicalField', sort: true, width: '105px', label: 'Municipality' },
    { prop: 'properties.primary_owner', id: 'primaryOwner', sort: true, label: 'Owner', },
    { prop: 'properties.primary_maintainer', id: 'primaryMaintainer', sort: true, label: 'Maintainer', },
    { prop: 'properties.common_name', id: 'commonName', sort: true, width: '112px', label: 'Common Name', },
    { prop: 'properties.gtms_structure', id: 'structure', width: '175px', sort: true, label: 'Span Structure', },
    { prop: 'properties.gtms_material', id: 'materials', width: '175px', sort: true, label: 'Span Materials' },
    { prop: 'properties.carried', id: 'carried', width: '175px', sort: true, label: 'Carried Feature', },
    { prop: 'properties.crossed', id: 'crossed', width: '175px', sort: true, label: 'Crossed Feature', },
    { prop: 'properties.crossed_mi', id: 'crossedMi', width: '100px', sort: true, label: 'Crossed Mi.' },
    { prop: 'properties.crossed_to', id: 'crossedTo', width: '100px', sort: true, label: 'Crossed To', },
    { prop: 'properties.location', id: 'location', sort: true, label: 'Location', },
    { prop: 'properties.posted_leg', id: 'postedLeg', sort: true, label: 'Posted Leg', },
    { prop: 'properties.other_post', id: 'otherPost', sort: true, label: 'Other Post', },
    { prop: 'properties.aadt', id: 'aadt', type: 'aadt', sort: true, label: 'AADT', },
    { prop: 'properties.year_built', id: 'yearBuilt', type: 'int', width: '110px', sort: true, label: 'Year Built', },
    { prop: 'properties.condition_field', id: 'conRat', type: 'numberHundredths', width: '100px', sort: true, label: 'Condition Rating' },
    { prop: 'properties.bridge_length', id: 'bridgeLength', type: 'numberHundredths', width: '100px', sort: true, label: 'Bridge Length' },
    { prop: 'properties.curb_to_curb', id: 'curbToCurb', type: 'numberHundredths', width: '100px', sort: true, label: 'Curb to Curb', },
    { prop: 'properties.deck_area_field', id: 'deckArea', type: 'numberHundredths', width: '100px', sort: true, label: 'Deck Area', },
    { prop: 'properties.posted_load', id: 'postedLoad', type: 'int', sort: true, label: 'Posted Load' },
    { prop: 'properties.restricted', id: 'restricted', type: 'int', sort: true, label: 'Restricted', },
    {
      prop: 'properties.total_hz_c', id: 'horizontalClearance', type: 'numberHundredths',
      width: '135px', sort: true, label: 'Horizontal Clearance',
    },
    {
      prop: 'properties.posted_vrt', id: 'verticalClearance', type: 'numberHundredths',
      width: '125px', sort: true, label: 'Vertical Clearance',
    },
    { prop: 'properties.permitted_field', id: 'permittedField', type: 'numberHundredths', sort: true, label: 'Permitted', },
    { prop: 'properties.latitude', id: 'latitude', sort: true,  type: 'latLon', width: '115px', label: 'Latitude' },
    { prop: 'properties.longitude', id: 'longitude', sort: true, type: 'latLon', width: '115px', label: 'Longitude', },
  );
