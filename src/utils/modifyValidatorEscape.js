const Check = require('./check');
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
function modifyValidatorEscape(
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
    ignore,
  ) => {
    if (!Check.isNumber(maxDeepDepth) || maxDeepDepth <= 0) {
      maxDeepDepth = Infinity;
    }

    if (!Check.isNumber(maxArrayDepth) || maxArrayDepth <= 0) {
      maxArrayDepth = Infinity;
    }

    let wasJsonString = false;
    if (Check.isString(obj)) {
      try {
        const json = JSON.parse(obj); // json-str to obj
        if (Check.isValidObject(json)) {
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

      if (_obj === null || _obj === undefined || Check.isObject(_obj)) {
        if (Check.isString(_obj)) {
          return _safeEscapeFunction(_obj, escapeFunction, unescapeFunction, ignore);
        }
        return _obj;
      }

      if (Check.isArray(_obj)) {
        const arr = [];
        if (_obj.length < maxArrayDepth) {
          _obj.forEach((_, i) => {
            arr[i] = _sanitizeObject(_obj[i], escapeFunction, unescapeFunction, depth);
          });
        } else if (!supressWarnings) {
          console.warn('WARNING (validator-utility): Exceeded max array depth (array).');
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

module.exports = modifyValidatorEscape;
