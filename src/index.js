import logFactory, { SQL, SERVER, STORE } from './logFactory';

// When no parameter is given, a default log will be created.
console.log('Create the default log: ', logFactory());

// Using the store parameter with an empty object will return the same result as above.
console.log('Create log for the Vuex store: ', logFactory({}, STORE));

/*
  Passing an object with 2 properties and the SQL parameter will result in a log
  object with those properties, plus the default properties for the WebSQL schema. Try
  removing `local_id` from the parameter object, and note that no default is set,
  so that WebSQL can generate a new local id. 
*/
console.log(
  'Create log for SQL insertion: ',
  logFactory({ notes: 'farmers are cool', local_id: 123 }, SQL),
);

/*
  Passing an object with the server parameter to send to farmOS. In this case,
  no default is set when the `id` property isn't set. Properties which the server
  will not recognize, like `isCachedLocally`, will also be ignored.
*/
console.log(
  'Create log for posting to farmOS server: ',
  logFactory(
    { notes: 'farmers are cool', local_id: 123, isCachedLocally: true },
    SERVER,
  ),
);
