/* eslint-disable global-require */
/* eslint-disable arrow-body-style */
const check = require('./utils/value');
const utils = require('./utils/utils');

const modifyValidatorEscape = require('./utils/modifyValidatorEscape');

class Validator {
  constructor() {
    this.maxDeepDepth = Infinity;
    this.maxArrayDepth = Infinity;
    this.supressWarnings = false;
    this.blacklist = [];

    const validator = require('validator');
    validator.escape = (str, ignore = this.blacklist || []) => {
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
  escapeString(str, ignore = this.blacklist || []) {
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
     * @param {boolean} supressWarnings wether to `console.warn` when an
     *                                  array/object exceeded the max depth.
     *                                  `false` by default.
     * @param {string[]|string} ignore
     * @returns the sanitized object/string. If the input is not a string or an object
     *          it'll be returned. If a JSON-String is inputed it'll parse it and return it back
     *          as a JSON-String (with the appropriate values sanitized).
     */
  escape(
    obj,
    maxDeepDepth = this.maxDeepDepth || Infinity,
    maxArrayDepth = this.maxArrayDepth || Infinity,
    supressWarnings = this.supressWarnings || false,
    ignore = this.blacklist || [],
  ) {
    return this.validator.escape(obj, maxDeepDepth, maxArrayDepth, supressWarnings, ignore);
  }

  configure(
    maxDeepDepth = Infinity,
    maxArrayDepth = Infinity,
    supressWarnings = false,
    ignore = [],
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
      this.supressWarnings = supressWarnings;
    } else {
      this.supressWarnings = false;
    }

    if (check.isValidArrayOrString(ignore)) {
      this.blacklist = ignore;
    } else {
      this.blacklist = [];
    }
  }

  init() {
    return this;
  }
}

module.exports = new Validator();
