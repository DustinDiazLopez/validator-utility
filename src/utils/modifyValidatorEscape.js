const check = require('./value');
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
    if (!check.isNumber(maxDeepDepth) || maxDeepDepth <= 0) {
      maxDeepDepth = Infinity;
    }

    if (!check.isNumber(maxArrayDepth) || maxArrayDepth <= 0) {
      maxArrayDepth = Infinity;
    }

    let wasJsonString = false;
    if (check.isString(obj)) {
      try {
        const json = JSON.parse(obj); // json-str to obj
        if (check.isValidObject(json)) {
          obj = json;
          wasJsonString = true;
        }
        // eslint-disable-next-line no-empty
      } catch (ignored) { }
    }

    function _sanitizeObject(
      _obj,
      escapeFunction,
      unescapeFunction,
      currentDeepDepth = 0,
      nestedArrayDepth = 0,
    ) {
      if (_obj instanceof Date) {
        // will break functionality of objects (use only for sending JSON responses)
        return _obj.toISOString();
      }

      if (_obj === null || _obj === undefined || typeof _obj !== 'object') {
        if (check.isString(_obj)) {
          return _safeEscapeFunction(_obj, escapeFunction, unescapeFunction, ignore);
        }
        return _obj;
      }

      if (check.isArray(_obj)) {
        const arr = [];
        if (_obj.length < maxArrayDepth && nestedArrayDepth < maxDeepDepth) {
          _obj.forEach((element, i) => {
            arr[i] = _sanitizeObject(
              element,
              escapeFunction,
              unescapeFunction,
              currentDeepDepth,
              nestedArrayDepth + (check.isArray(element) ? 1 : 0),
            );
          });
        } else if (!supressWarnings) {
          console.warn('WARNING (validator-utility): Exceeded max array depth (array).');
        }
        return arr;
      }

      const sanitized = {};
      if (currentDeepDepth < maxDeepDepth) {
        for (const i in _obj) {
          if (i === '_id' && typeof _obj[i] === 'object') {
            const serialId = _obj[i].toString();
            sanitized[i] = _sanitizeObject(
              serialId,
              escapeFunction,
              unescapeFunction,
              currentDeepDepth + 1,
              nestedArrayDepth,
            );
          } else {
            sanitized[i] = _sanitizeObject(
              _obj[i],
              escapeFunction,
              unescapeFunction,
              currentDeepDepth + 1,
              nestedArrayDepth,
            );
          }
        }
      } else if (!supressWarnings) {
        console.warn('WARNING (validator-utility): Exceeded max deep depth (object).');
      }

      return sanitized;
    }

    const result = _sanitizeObject(obj, _oldValidatorEscapeRef, _validator.unescape, 0, 1);
    return wasJsonString ? JSON.stringify(result) : result;
  };
}

module.exports = modifyValidatorEscape;
