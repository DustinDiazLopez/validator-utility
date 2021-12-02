/* eslint-disable arrow-body-style */

const __validatorGlobals = {
  maxDeepDepth: undefined,
  maxArrayDepth: undefined,
  supressWarnings: undefined,
  blacklist: undefined,
};

/**
 * <strong>NOTE: ONLY USE THIS FUNCTION FOR SENDING JSON OBJECTS (i.e.,
 * use only for sending JSON responses)</strong>
 *
 * NOTE: for key `_id` if it's an object make sure it has a .toString() method
 * NOTE: for `instanceof Date` the function `.toISOString()` will be called
 *
 * Modifies the validator.escape method to support escaping the string
 * values of objects.
 *
 * @param {validator} _validator reference to the validator object
 * @param {Function} _oldValidatorEscapeRef reference to the old function of validator.escape
 * @author Dustin Diaz
 * @example
 * const validator = require('validator');
 * const _validatorEscape = validator.escape;
 * modifyValidatorEscape(validator, _validatorEscape);
 *
 */
function _modifyValidatorEscape(
  _validator,
  _oldValidatorEscapeRef,
  _safeEscapeFunction,
) {
  // reasign the old validator.escape to the new function
  _validator.escape = (
    obj,
    maxDeepDepth,
    maxArrayDepth,
    supressWarnings,
    blacklist,
  ) => {
    function _isNumber(_obj) {
      return typeof _obj === 'number';
    }

    function _isString(_obj) {
      return typeof _obj === 'string' || _obj instanceof String;
    }

    function _isArray(_obj) {
      return Array.isArray(_obj) || _obj instanceof Array;
    }

    if (!_isNumber(maxDeepDepth) || maxDeepDepth <= 0) {
      maxDeepDepth = Infinity;
    }

    if (!_isNumber(maxArrayDepth) || maxArrayDepth <= 0) {
      maxArrayDepth = Infinity;
    }

    let wasJsonString = false;
    if (_isString(obj)) {
      try {
        const json = JSON.parse(obj); // json-str to obj
        if (json && typeof json === 'object') {
          obj = json;
          wasJsonString = true;
        }
        // eslint-disable-next-line no-empty
      } catch (ignored) { }
    }

    function _sanitizeObject(_obj, escapeFunction, unescapeFunction, depth = 0) {
      if (_obj instanceof Date) {
        // will break functionality of objects (use only for sending JSON responses)
        return _obj.toISOString();
      }

      if (_obj === null || _obj === undefined || typeof _obj !== 'object') {
        if (_isString(_obj)) {
          return _safeEscapeFunction(_obj, escapeFunction, unescapeFunction, blacklist);
        }
        return _obj;
      }

      if (_isArray(_obj)) {
        const arr = [];
        if (_obj.length < maxArrayDepth) {
          _obj.forEach((_, i) => {
            arr[i] = _sanitizeObject(_obj[i], escapeFunction, unescapeFunction, depth);
          });
        } else if (!supressWarnings) {
          console.log('WARNING (validator-utility): Exceeded max array depth (array).');
        }
        return arr;
      }

      const sanitized = {};
      if (depth < maxDeepDepth) {
        for (const i in _obj) {
          if (i === '_id' && typeof _obj[i] === 'object') {
            const serialId = _obj[i].toString();
            sanitized[i] = _sanitizeObject(serialId, escapeFunction, unescapeFunction, depth + 1);
          } else {
            sanitized[i] = _sanitizeObject(_obj[i], escapeFunction, unescapeFunction, depth + 1);
          }
        }
      } else if (!supressWarnings) {
        console.warn('WARNING (validator-utility): Exceeded max deep depth (object).');
      }

      return sanitized;
    }

    const result = _sanitizeObject(obj, _oldValidatorEscapeRef, _validator.unescape, 0);
    return wasJsonString ? JSON.stringify(result) : result;
  };
}

/**
 * Modifies the `escape` function in the validator package and returns the validator object.
 * @returns the validator object with the `escape` function modified.
 */
function _init() {
  const _notValidStringOrArray = (value) => {
    return !value && !(Array.isArray(value) || (typeof value === 'string' || value instanceof String));
  };

  // eslint-disable-next-line global-require
  const validatorPackage = require('validator');
  validatorPackage.escape = (str, blacklist = __validatorGlobals.blacklist) => {
    if (!(typeof str === 'string' || value instanceof String)) {
      throw new TypeError('validator-utility - escape/escapeString expected a string but got', typeof str);
    }

    if (_notValidStringOrArray(blacklist)) {
      blacklist = [];
    }

    let result = str;
    if (!blacklist.includes('&')) {
      result = result.replace(/&/g, '&amp;');
    }
    if (!blacklist.includes('"')) {
      result = result.replace(/"/g, '&quot;');
    }
    if (!blacklist.includes('\'')) {
      result = result.replace(/'/g, '&#x27;');
    }
    if (!blacklist.includes('<')) {
      result = result.replace(/</g, '&lt;');
    }
    if (!blacklist.includes('>')) {
      result = result.replace(/>/g, '&gt;');
    }
    if (!blacklist.includes('/')) {
      result = result.replace(/\//g, '&#x2F;');
    }
    if (!blacklist.includes('\\')) {
      result = result.replace(/\\/g, '&#x5C;');
    }
    if (!blacklist.includes('`')) {
      result = result.replace(/`/g, '&#96;');
    }
    return result;
  };
  validatorPackage.escapeString = validatorPackage.escape;
  _modifyValidatorEscape(
    validatorPackage,
    validatorPackage.escapeString,
    (_str, escapeFunction, unescapeFunction, blacklist) => {
      if (escapeFunction && unescapeFunction) {
      // string value may have already been escaped, which may cause other literals like
      // `<` to be re-escaped, for example, `<` turns into `&lt;` which if re-escaped
      // will turn into `&amp;lt`
        return escapeFunction(unescapeFunction(_str), blacklist);
      }

      return escapeFunction(_str);
    },
  );
  const newValidatorEscapeRef = validatorPackage.escape;
  delete validatorPackage.escape;
  const result = {
    ...validatorPackage,
    configure: (maxDeepDepth, maxArrayDepth, supressWarnings, blacklist) => {
      if (typeof maxDeepDepth === 'number' && maxDeepDepth > 0) {
        __validatorGlobals.maxDeepDepth = maxDeepDepth;
      } else {
        __validatorGlobals.maxDeepDepth = undefined;
      }

      if (typeof maxArrayDepth === 'number' && maxArrayDepth > 0) {
        __validatorGlobals.maxArrayDepth = maxArrayDepth;
      } else {
        __validatorGlobals.maxArrayDepth = undefined;
      }

      if (typeof supressWarnings === 'boolean') {
        __validatorGlobals.supressWarnings = supressWarnings;
      } else {
        __validatorGlobals.supressWarnings = undefined;
      }

      if (Array.isArray(blacklist) || (typeof blacklist === 'string' || blacklist instanceof String)) {
        __validatorGlobals.blacklist = blacklist;
      } else {
        __validatorGlobals.blacklist = undefined;
      }
    },
    /**
     * Replace `<`, `>`, `&`, `'`, `"` and `/` in every value inside an object
     * @param {any} obj the object/string to sanitize. Required.
     * @param {number} maxDeepDepth maximum allowed recursion depth.
     *                                        `Infinity` by default.
     * @param {number} maxArrayDepth maximing allowed array size (depth).
     *                                         `Infinity` by default.
     * @param {boolean} supressWarnings wether to `console.warn` when an
     *                                            array/object exceeded the max depth.
     *                                            `false` by default.
     * @param {string[]|string} blacklist
     * @returns the sanitized object/string. If the input is not a string or an object
     *          it'll be returned. If a JSON-String is inputed it'll parse it and return it back
     *          as a JSON-String (with the appropriate values sanitized).
     */
    escape: (
      obj,
      maxDeepDepth = __validatorGlobals.maxDeepDepth || Infinity,
      maxArrayDepth = __validatorGlobals.maxArrayDepth || Infinity,
      supressWarnings = __validatorGlobals.supressWarnings || Infinity,
      blacklist = __validatorGlobals.blacklist || [],
    ) => newValidatorEscapeRef(
      obj,
      maxDeepDepth,
      maxArrayDepth,
      supressWarnings,
      blacklist,
    ),
  };
  return result;
}

const __validatorUtilityPackage = _init();
module.exports = {
  ...__validatorUtilityPackage,
  /**
   * Modifies the `escape` function in the validator package and returns the validator object.
   * @returns the validator object with the `escape` function modified.
   * @deprecated use default
   * @example const validator = require('validator-utility');
   */
  init: () => __validatorUtilityPackage,
  modifyValidatorEscape: _modifyValidatorEscape,
};
