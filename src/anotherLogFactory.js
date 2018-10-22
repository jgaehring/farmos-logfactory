const SQL = 'WEBSQL';
const SERVER = 'FARMOS_SERVER';
const STORE = 'VUEX_STORE';

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
          images,
          done,
          isCachedLocally,
          wasPushedToServer,
          remoteUri,
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
        };
        /*
          Only return local_id property if one has already been assigned by WebSQL,
          otherwise let WebSQL assign a new one.
        */
        if (local_id) {
          // eslint-disable-line camelcase
          log.local_id = local_id; // eslint-disable-line camelcase
        }
        return JSON.stringify(log);
      }
      // The format for sending logs to the farmOS REST Server.
      if (dest === SERVER) {
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
          images: parseImages(images),
          // Use JSON.parse() to convert strings back to booleans
          done: JSON.parse(done),
          wasPushedToServer: JSON.parse(wasPushedToServer),
          remoteUri,
        };
      }
    };
  }
};

function parseImages(x) {
  if (typeof x === 'object') {
    return x;
  }
  if (typeof x === 'string') {
    return x === '' ? [] : [].concat(x);
  }
  throw new Error(`${x} cannot be parsed as an image array`);
}

const log = {
  create: makeLogFactory(),
  toStore: makeLogFactory(STORE, STORE),
  toSql: makeLogFactory(STORE, SQL),
  toServer: makeLogFactory(STORE, SERVER),
  fromSql: makeLogFactory(SQL, STORE),
};

export default log;
