/*
  This sandbox is for testing the logFactory used in the farmOS native
  and client libraries.

  You can run some tests in the console from `src/index.js`, or run the
  example log statements already contained there.

  To see what's happening internally, checkout `src/logFactory.js`.
  The main function export in there is essentially the same one that's
  contained in the farmos-native repository, though it may be outdated
  depending on when you're reading this and how frequently I've managed
  to update this sandbox.
*/
// Note that we're importing all the parameters we need along with the logFactory itself
import logFactory, { SQL, SERVER, STORE } from './logFactory';
import log from './anotherLogFactory';

// When no parameter is given, a default log will be created.
const defaultLog = logFactory();
console.log('Create the default log: ', defaultLog);

// Using the store parameter with an empty object will return the same result as above.
const storeLog = logFactory({}, STORE);
console.log('Create log for the Vuex store: ', storeLog);

/*
  Passing an object with 2 properties and the SQL parameter will result in a log
  object with those properties, plus the default properties for the WebSQL schema. Try
  removing `local_id` from the parameter object, and note that no default is set,
  so that WebSQL can generate a new local id. 
*/
const sqlLog = logFactory({ notes: 'farmers are cool', local_id: 123 }, SQL);
console.log('Create log for SQL insertion: ', sqlLog);

/*
  Passing an object with the server parameter to send to farmOS. In this case,
  no default is set when the `id` property isn't set. Properties which the server
  will not recognize, like `isCachedLocally`, will also be ignored.
*/
const serverLog = logFactory(
  {
    notes: 'farmers are cool',
    local_id: 123,
    isCachedLocally: true,
  },
  SERVER,
);
console.log('Create log for posting to farmOS server: ', serverLog);

/* 
  This is a new implementation of the logFactory, currently contained in
  the module `anotherLogFactory.js`. Below are some tests to demonstrate
  how it works.
*/

const newLog = log.create();
console.log('New log: ', newLog);

const storeToStore = log.storeToStore({
  log_owner: 'Fred',
  notes: 'farmers are cool',
  quantity: '',
  id: '101',
  local_id: '5',
  name: 'Oct 10 Observation',
  type: 'farm_observation',
  timestamp: '1539129600',
  images: [],
  done: false,
  isCachedLocally: true,
  wasPushedToServer: true,
  remoteUri: 'http://test.farmos.net/log/101',
});
console.log('storeToStore: ', storeToStore);

const serializedSqlLog = log.storeToSql(storeToStore);
console.log('storeToSql: ', serializedSqlLog);

const storeToServer = log.storeToServer(storeToStore);
console.log('storeToServer: ', storeToServer);

const sqlToStore = log.sqlToStore(serializedSqlLog);
console.log('sqlToStore: ', sqlToStore);
