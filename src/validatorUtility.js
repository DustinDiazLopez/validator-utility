/* eslint-disable global-require */
/* eslint-disable arrow-body-style */
const check = require('./utils/value');
const utils = require('./utils/utils');

const modifyValidatorEscape = require('./utils/modifyValidatorEscape');

class Validator {
  constructor() {
    this.maxDeepDepth = Infinity;
    this.maxArrayDepth = Infinity;
    this.suppressWarnings = false;
    this.ignore = [];
    this.truncateArray = false;

    const validator = require('validator');
    validator.escape = (str, ignore = this.ignore || []) => {
      return utils.escape(str, ignore);
    };
    validator.escapeString = validator.escape;
    modifyValidatorEscape(
      validator,
      validator.escapeString,
      utils.safeEscape,
    );
    this.validator = validator;

    const keys = Object.keys(validator);
    for (const key of keys) {
      switch (key) {
        case 'escape':
        case 'escapeString':
        case 'configure':
        case 'init':
          break;
        default:
          this[key] = validator[key];
      }
    }
  }

  /**
   * Replace `<`, `>`, `&`, `'`, `"` and `/` with HTML entities.
   */
  escapeString(str, ignore = this.ignore || []) {
    return this.validator.escapeString(str, ignore);
  }

  /**
   * Replaces HTML encoded entities with `<`, `>`, `&`, `'`, `"` and `/`.
   */
  unescapeString(str) {
    return this.validator.unescape(str);
  }

  /**
   * Replace `<`, `>`, `&`, `'`, `"` and `/` in every value inside an object
   * @param {any} obj the object/string to sanitize. Required.
   * @param {number} maxDeepDepth maximum allowed recursion depth.
   *                              `Infinity` by default.
   * @param {number} maxArrayDepth maximing allowed array size (depth).
   *                               `Infinity` by default.
   * @param {boolean} suppressWarnings wether to `console.warn` when an
   *                                  array/object exceeded the max depth.
   *                                  `false` by default.
   * @param {boolean} truncateArray if true, the array will be truncated if `maxArrayDepth` is
   *                                exceeded. If false, the array will not be processed if
   *                                `maxArrayDepth` is exceeded.
   *
   * @param {string[]|string} ignore characters that will NOT be escaped.
   * @returns the sanitized object/string. If the input is not a string or an object
   *          it'll be returned. If a JSON-String is inputed it'll parse it and return it back
   *          as a JSON-String (with the appropriate values sanitized).
   */
  escape(
    obj,
    maxDeepDepth = this.maxDeepDepth || Infinity,
    maxArrayDepth = this.maxArrayDepth || Infinity,
    suppressWarnings = this.suppressWarnings || false,
    ignore = this.ignore || [],
    truncateArray = this.truncateArray || false,
  ) {
    return this.validator.escape(
      obj,
      maxDeepDepth,
      maxArrayDepth,
      suppressWarnings,
      ignore,
      truncateArray,
    );
  }

  configure(
    maxDeepDepth = Infinity,
    maxArrayDepth = Infinity,
    supressWarnings = false,
    ignore = [],
    truncateArray = false,
  ) {
    if (check.isNumber(maxDeepDepth) && maxDeepDepth > 0) {
      this.maxDeepDepth = maxDeepDepth;
    } else {
      this.maxDeepDepth = Infinity;
    }

    if (check.isNumber(maxArrayDepth) && maxArrayDepth > 0) {
      this.maxArrayDepth = maxArrayDepth;
    } else {
      this.maxArrayDepth = Infinity;
    }

    if (check.isBoolean(supressWarnings)) {
      this.suppressWarnings = supressWarnings;
    } else {
      this.suppressWarnings = false;
    }

    if (check.isValidArrayOrString(ignore)) {
      this.ignore = ignore;
    } else {
      this.ignore = [];
    }

    if (check.isBoolean(truncateArray)) {
      this.truncateArray = truncateArray;
    } else {
      this.truncateArray = false;
    }

    return this;
  }

  /**
   * Calls the `.configure(...)` method.
   * @param {object} options `maxDeepDepth`, `maxArrayDepth`, `suppressWarnings`, `ignore`, and
   *                         `truncateArray`
   */
  config(options) {
    return this.configure(
      options.maxDeepDepth,
      options.maxArrayDepth,
      options.suppressWarnings,
      options.ignore,
      options.truncateArray,
    );
  }

  init() {
    return this;
  }
}

module.exports = new Validator();
