/**
 * This is just an experiment and can be ignored. My goal is to make
 * logFactory more functional by currying it and using more function
 * composition. This requires abstracting the role of the logFactory as a
 * higher order fucntion, which may be more trouble than it's worth, but
 * could pay off if we decide to parameterize the source of the log, along
 * with the destination parameter.
 */

/*
  DESCRIBE WHAT THE LOGFACTORY FUNCTION DOES
  The first argument declares the expected type of input data (ie, the third 
  argument), while the second argument declares the required type of return value. 
  Note that the first is just is an expectation, intended to avoid unecessary errors
  within the body of the function itself, while the second is a requirement, to avoid
  errors at the ultimate destination. Most importantly, neither provides the schemata
  itself, but the name or key of the schemata, which the function will provide and 
  while also figureing out how to match that against the input values provided in the
  third argument.
*/

/**
 * Maybe I just need to stash the template for each location in a const, then have
 * just one function, which just takes a string and returns the appropriate template,
 * so it can be called on both the src & dest consts. Then those templates can be
 * matched against each other to generate default params, and finally those default
 * params can be matched against the input data, to return the final value.
 */

export const SQL = 'WEBSQL';
export const SERVER = 'SERVER';
export const STORE = 'VUEX';

// Just one example here; could live in a separate file, perhaps with location const's
const vuexStoreTemplate = [
  {
    key: 'log_owner',
    default: '',
  },
  {
    key: 'notes',
    default: '',
  },
  {
    key: 'quantity',
    default: '',
  },
  {
    key: 'id',
    default: '',
  },
  {
    key: 'local_id',
    default: '',
  },
  {
    key: 'name',
    default: '',
  },
  {
    key: 'type',
    default: '',
  },
  {
    key: 'timestamp',
    default: '',
  },
  {
    key: 'photo_loc',
    default: '',
  },
  {
    key: 'done',
    default: false,
  },
  {
    key: 'isCachedLocally',
    default: false,
  },
  {
    key: 'wasPushedToServer',
    default: false,
  },
];

const webSqlTemplate = [
  /* ... */
];
const farmosServerTemplate = [
  /* ... */
];

function getTemplate(loc) {
  loc === undefined || loc === STORE
    ? vuexStoreTemplate
    : loc === SQL
      ? webSqlTemplate
      : loc === SERVER
        ? farmosServerTemplate
        : new Error(`The supplied location parameter is invalid.
             See logFactory.js for a list of valid source and destination parameters`);
}

/**
 * Still not 100% what I'm doing here, but I think I'm finally on the right track,
 * rather than what I was trying to do further below.
 */
// logFactory :: getTemplate -> src -> dest -> dataObj -> logObj
const makeLogFactory = getTemplate => src => dest => dataObj => {
  const srcTemp = getTemplate(src);
  const destTemp = getTemplate(dest);
  // This could also be abstracted out as some sort of `templateReducer()` function
  const log = destTemp.reduce((logObj, curDestProp) => {
    return srcTemp.forEach(curSrcProp => {
      if (
        curSrcProp.key === curDestProp.key ||
        /** filter for aliases too */ false
      ) {
        logObj[curDestProp.key] = curSrcProp.default;
      }
    });
    // Still need to then map the dataObj's props onto the logObj accumulator
    const dataKeys = Object.keys(dataObj);
    // What do I do with the keys now?
    return logObj;
  }, {});
  return log;
};

const logFactory = makeLogFactory(getTemplate);
export default logFactory;
// OLD IDEAS BELOW
//
//
//
//
//
/*
  The first two parameters each tell the function what type of inputs to expect, 
  and what defaults to return, within a constrained set of options (eg, server, 
  SQL, etc). The last parameter takes a set of user-defined properties and remembers 
  them so the other parts of the operation can apply them against the requirements 
  for each destination, and the expected input of a given source
*/

// // logFactory :: (src -> defParams) -> (dest -> template) -> dataObj -> logObj
// function lf (getDefParams, getTemplate, dataObj) {
//   return function (getDefParams) {
//     return function (getTemplate) {
//       return function (dataObj) {
//         logObj = {}
//       }
//     }
//   }
// }

// // logFactory :: (src -> defParams) -> (dest -> template) -> dataObj -> logObj
// function getLogFactory (getDefParams, getTemplate) {
//   return function (src, dest, dataObj) {
//     const defParams = getDefParams(src);
//     const template = getTemplate(dest);
//     function (dataObj) {
//       templateKeys = Object.keys(template)
//       const realParams = templateKeys.map((tempKey) => {
//         defParams.map(defParam => {
//           if (defParam.key === tempKey) {
//             return {tempKey: defParam.}
//           }
//         })

//       })
//     }
//   }
// }

// // getDefParams :: loc -> defParams
// function getDefParams(loc) {
//   let defParams;
//   if (loc === STORE) {
//     // other possible props: `required` and `aliases`
//     return defParams
//   }
//   function paramsReducer(acc, cur) {
//     acc + cur
//   }
//   // Can I return a string that I can call eval on?
//   return defParams.reduce();
// }

// getTemplate :: dest -> template
// function getTemplate(dest) {
//   const template = {};
//   return template;
// }
