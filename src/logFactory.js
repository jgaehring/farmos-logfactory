/*
  DESTINATIONS
  Import these destination constants when you import the logFactory, and use
  them instead of using the raw strings. This will make it easier to update the
  logFactory's API in the future without committing breaking changes. The
  constants are assigned to string values representing the possible destinations
  to which the logs may be sent.
*/
export const SQL = 'WEBSQL';
export const SERVER = 'FARMOS_SERVER';
export const STORE = 'VUEX_STORE';

/*
  LOGFACTORY
  A utility function for structuring logs within the data plugin. It can be
  applied to an existing log before storing it in the database, posting it to
  the server, or for otherwise rendering logs in a standard format. It can also
  be used to generate a new log for the Vuex store by passing in no parameters.
  Provide an optional `dest` parameter to ensure the proper formatting for its
  destination. TODO: It could be wise to add a source parameter as well.

  A CodeSandbox for experimenting with it can be found here:
  https://codesandbox.io/s/github/jgaehring/farmos-logfactory
*/
export default function (
  // Assign default properties or leave them as optional
  {
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
  } = {},
  dest,
) {
  let log;
  /*
    The format for adding logs to the Vuex store; this is also the default
    if there is no destination argument passed.
  */
  if (dest === STORE || dest === undefined) {
    log = {
      log_owner,
      notes,
      quantity,
      id,
      local_id,
      name,
      type,
      timestamp,
      // Use Array.concat() to make sure this is an array
      images: parseImages(images),
      // Use JSON.parse() to convert strings back to booleans
      done: JSON.parse(done),
      isCachedLocally: JSON.parse(isCachedLocally),
      wasPushedToServer: JSON.parse(wasPushedToServer),
      remoteUri,
    };
  }
  // The format for sending logs to the farmOS REST Server.
  if (dest === SERVER) {
    log = {
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
  }
  // The format for inserting logs in WebSQL for local persistence.
  if (dest === SQL) {
    log = {
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
    if (local_id) { // eslint-disable-line camelcase
      log.local_id = local_id; // eslint-disable-line camelcase
    }
  }
  return log;
}

/*
  This utility function, along with the use of `JSON.parse()` above,
  provide a quick hacky solution, but we need something better
  for parsing data when it goes between Vuex and WebSQL. See:
  https://github.com/farmOS/farmOS-native/issues/27#issuecomment-412093491
  https://github.com/farmOS/farmOS-native/issues/40#issuecomment-419131892
  https://github.com/farmOS/farmOS-native/issues/45
*/
function parseImages(x) {
  if (typeof x === 'object') {
    return x;
  }
  if (typeof x === 'string') {
    return (x === '') ? [] : [].concat(x);
  }
  throw new Error(`${x} cannot be parsed as an image array`);
}
