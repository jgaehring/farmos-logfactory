const SQL = 'WEBSQL';
const SERVER = 'FARMOS_SERVER';
const STORE = 'VUEX_STORE';

function parseObjects(x) {
  if (typeof x === 'object') {
    return x;
  }
  if (typeof x === 'string') {
    return JSON.parse(x);
  }
  throw new Error(`${x} cannot be parsed as an image array`);
}

const makeLogFactory = (src, dest) => {
  if (src === STORE || src === undefined) {
    return function({
      log_owner = '', // eslint-disable-line camelcase
      notes = '',
      quantity = '',
      id,
      local_id, // eslint-disable-line camelcase
      name = '',
      type = '',
      timestamp = '',
      images = [],
      done = false,
      isCachedLocally = false,
      wasPushedToServer = false,
      remoteUri = '',
      field_farm_asset = [], // eslint-disable-line camelcase
      field_farm_area = [], // eslint-disable-line camelcase
      field_farm_geofield = [], // eslint-disable-line camelcase
    } = {}) {
      if (dest === STORE || dest === undefined) {
        return {
          log_owner,
          notes,
          quantity,
          id,
          local_id,
          name,
          type,
          timestamp,
          images: parseObjects(images),
          // Use JSON.parse() to convert strings back to booleans
          done: JSON.parse(done),
          isCachedLocally: JSON.parse(isCachedLocally),
          wasPushedToServer: JSON.parse(wasPushedToServer),
          remoteUri,
          field_farm_asset: parseObjects(field_farm_asset),
          field_farm_area: parseObjects(field_farm_area),
          field_farm_geofield: parseObjects(field_farm_geofield),
        };
      }
      // The format for inserting logs in WebSQL for local persistence.
      if (dest === SQL) {
        let log = {
          log_owner,
          notes,
          quantity,
          id,
          name,
          type,
          timestamp,
          images,
          done,
          wasPushedToServer,
          remoteUri,
          field_farm_asset: JSON.stringify(field_farm_asset),
          field_farm_area: JSON.stringify(field_farm_area),
          field_farm_geofield: JSON.stringify(field_farm_geofield),
        };
        /*
          Only return local_id property if one has already been assigned by WebSQL,
          otherwise let WebSQL assign a new one.
        */
        if (local_id) {
          log.local_id = local_id;
        }
        return JSON.stringify(log);
      }
      // The format for sending logs to the farmOS REST Server.
      if (dest === SERVER) {
        // Just take the id from the assets/areas before sending
        const assets = field_farm_asset.map(asset => ({ id: asset.id }));
        const areas = field_farm_area.map(area => ({ id: area.tid }));
        let log = {
          field_farm_notes: {
            format: 'farm_format',
            value: `<p>${notes}</p>\n`,
          },
          // quantity,
          name,
          type,
          timestamp,
          field_farm_images: images,
          field_farm_asset: assets,
          field_farm_area: areas,
          field_farm_geofield,
        };
        /*
          Only return id property if one has already been assigned by the server,
          otherwise omit it so the server can assign a new one.
        */
        if (id) {
          log.id = id;
        }
        return log;
      }
    };
  }
  if (src === SQL) {
    return function(serializedJSON) {
      const {
        log_owner,
        notes,
        quantity,
        id,
        local_id,
        name,
        type,
        timestamp,
        images,
        done,
        wasPushedToServer,
        remoteUri,
        field_farm_asset,
        field_farm_area,
        field_farm_geofield,
      } = JSON.parse(serializedJSON);
      if (dest === STORE || dest === undefined) {
        return {
          log_owner,
          notes,
          quantity,
          id,
          local_id,
          name,
          type,
          timestamp,
          // Use parseImages() to make sure this is an array,
          images: parseObjects(images),
          // Use JSON.parse() to convert strings back to booleans
          done: JSON.parse(done),
          wasPushedToServer: JSON.parse(wasPushedToServer),
          remoteUri,
          field_farm_asset: parseObjects(field_farm_asset),
          field_farm_area: parseObjects(field_farm_area),
          field_farm_geofield: parseObjects(field_farm_geofield),
        };
      }
    };
  }
};

const log = {
  create: makeLogFactory(),
  toStore: makeLogFactory(STORE, STORE),
  toSql: makeLogFactory(STORE, SQL),
  toServer: makeLogFactory(STORE, SERVER),
  fromSql: makeLogFactory(SQL, STORE),
};

export default log;
