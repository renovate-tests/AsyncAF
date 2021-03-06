import callback from '../_internal/commonCallback'; // eslint-disable-line no-unused-vars
import permissiveIsArrayLike from '../_internal/permissiveIsArrayLike';
import promiseAllWithHoles from '../_internal/promiseAllWithHoles';
import {parallel, serial} from '../_internal/resolve';

/**
 * creates a new `Array` with the results of calling a provided function on every element in the original array
 *
 * if any elements are a `Promise`, they will first be resolved in parallel and then processed
 *
 * *Note*: if you'd rather resolve and process elements in series, consider using `series.mapAF` or its alias, `io.mapAF`
 *
 * @param {callback} callback function that produces an element of the new `Array`
 *
 * `callback` accepts three arguments:
 * - `currentValue` value of the current element being processed in the array
 * - `index`*`(optional)`* index of `currentValue` in the array
 * - `array`*`(optional)`* the array that mapAF is being applied to
 * @param {Object=} thisArg value to use as `this` when executing `callback`
 * @returns {Promise.<Array>} `Promise` that resolves to a new `Array` with each element being the result of calling `callback` on each original element
 * @example
 *
 * const promises = [1, 2].map(n => Promise.resolve(n));
 *
 *
 * // basic usage
 * const doubled = AsyncAF(promises).mapAF(el => el * 2);
 *
 * console.log(doubled); // Promise that resolves to [2, 4]
 *
 * AsyncAF.logAF(doubled); // logs [2, 4]
 *
 *
 * // using .then
 * AsyncAF(promises).mapAF(el => el * 3).then(tripled => {
 *   console.log(tripled); // logs [3, 6]
 * });
 *
 *
 * // inside an async function
 * (async () => {
 *   const quadrupled = await AsyncAF(promises).mapAF(
 *     el => el * 4
 *   );
 *   console.log(quadrupled); // logs [4, 8]
 * })();
 * @since 3.0.0
 * @see map (alias)
 * @see {@link AsyncAF#series series.mapAF}
 * @memberof AsyncAF#
 */
const mapAF = function (callback, thisArg = undefined) {
  return this.then(arr => {
    if (!permissiveIsArrayLike(arr)) throw TypeError(
      `mapAF cannot be called on ${arr}, only on an Array or array-like Object`,
    );
    if (typeof callback !== 'function') throw TypeError(`${callback} is not a function`);
    return this.inSeries
      ? serial(arr).then(arr => arr.reduce((map, el, i, arr) => map.then(map => {
        map[i] = Promise.resolve(callback.call(thisArg, el, i, arr));
        return promiseAllWithHoles(map);
      }), Promise.resolve(Array(arr.length >>> 0))))
      : parallel(arr, callback, thisArg);
  });
};

export default mapAF;
