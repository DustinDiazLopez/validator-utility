const __validator = require('validator');

/**
 * <strong>NOTE: ONLY USE THIS FUNCTION FOR SENDING JSON OBJECTS (i.e.,
 * use only for sending JSON responses)</strong>
 *
 * NOTE: for key `_id` if it's an object make sure it has a .toString() method
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
 * require('path/to/sanitize.js').modifyValidatorEscape(validator, _validatorEscape);
 *
 * TODO:
 *  - add max depth for recursion
 *  - add max depth for arrays
 */
function modifyValidatorEscape(_validator, _oldValidatorEscapeRef) {
  _validator.escape = function escape(obj, maxDeepDepth = Infinity, maxArrayDepth = Infinity) {
    let wasJsonString = false;
    if (typeof obj === 'string') {
      try {
        const json = JSON.parse(obj); // json-str to obj
        if (json && typeof json === 'object') {
          obj = json;
          wasJsonString = true;
        }
        // eslint-disable-next-line no-empty
      } catch (ignored) { }
    }

    function _isString(_obj) {
      return typeof _obj === 'string' || _obj instanceof String;
    }

    function _isArray(_obj) {
      return Array.isArray(_obj) || _obj instanceof Array;
    }

    function _safeEscape(_str, escapeFunction, unescapeFunction) {
      // string value may have already been escaped, which may cause other literals like
      // `<` to be re-escaped, for example, `<` turns into `&lt;` which if re-escaped
      // will turn into `&amp;lt`
      return escapeFunction(unescapeFunction(_str));
    }

    function _sanitizeObject(_obj, escapeFunction, unescapeFunction) {
      if (_obj instanceof Date) {
        // will break functionality of objects (use only for sending JSON responses)
        return _obj.toISOString();
      }

      if (_obj === null || _obj === undefined || typeof _obj !== 'object') {
        if (_isString(_obj)) {
          return _safeEscape(_obj, escapeFunction, unescapeFunction);
        }
        return _obj;
      }

      if (_isArray(_obj)) {
        const arr = [];
        _obj.forEach((_, i) => {
          arr[i] = _sanitizeObject(_obj[i], escapeFunction, unescapeFunction);
        });
        return arr;
      }

      const sanitized = {};
      for (const i in _obj) {
        if (i === '_id' && typeof _obj[i] === 'object') {
          const serialId = _obj[i].toString();
          sanitized[i] = _sanitizeObject(serialId, escapeFunction, unescapeFunction);
        } else {
          sanitized[i] = _sanitizeObject(_obj[i], escapeFunction, unescapeFunction);
        }
      }

      return sanitized;
    }

    const result = _sanitizeObject(obj, _oldValidatorEscapeRef, _validator.unescape);
    return wasJsonString ? JSON.stringify(result) : result;
  };
}

function init() {
  __validator.escapeString = __validator.escape;
  modifyValidatorEscape(__validator, __validator.escapeString);
  return __validator;
}

exports.init = init;
exports.modifyValidatorEscape = modifyValidatorEscape;
