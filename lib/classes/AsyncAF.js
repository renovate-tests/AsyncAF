import createNewlessClass from '../methods/_internal/createNewlessClass';
import {AsyncAfWrapperProto as AsyncAfProto} from './AsyncAfWrapper';
import {staticMethods, prototypeMethods} from '../../packageList';

/**
 * class that holds all the AsyncAF methods
 *
 * while AsyncAF is a class, it can create instances with or without the `new` keyword
 * @param {any} data the data to be wrapped by the AsyncAF class; can be promises or non-promises
 * @returns {Object} returns an instance of AsyncAF wrapping the passed in data
 * @example
 *
 * const promises = [1, 2, 3].map(n => Promise.resolve(n));
 *
 *
 * AsyncAF(promises).mapAF(n => n * 2).filterAF(n => n !== 4).forEachAF(n => console.log(n));
 * // logs 2 then 6
 * @since 3.0.0
 * @see AsyncAfWrapper
 * @class AsyncAF
 */
const AsyncAF = createNewlessClass(
  class AsyncAF extends AsyncAfProto {},
);

const prepForDefine = methods => methods.reduce((methods, method) => {
  // add all '*AF' methods and add 'AF-less' aliases (e.g., mapAF -> map)
  const [alias] = method.name.split`AF` || /* istanbul ignore next */ [method.name];
  return Object.assign(
    methods, {[method.name]: {value: method}}, {[alias]: {value: method}},
  );
}, {});

Object.defineProperties(AsyncAfProto, prepForDefine(staticMethods));
Object.defineProperties(AsyncAfProto.prototype, prepForDefine(prototypeMethods));

export default AsyncAF;
