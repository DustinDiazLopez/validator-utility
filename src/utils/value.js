/* eslint-disable class-methods-use-this */
class Value {
  isNumber(o) {
    return typeof o === 'number' || o instanceof Number;
  }

  isString(o) {
    return typeof o === 'string' || o instanceof String;
  }

  isArray(o) {
    return Array.isArray(o) || o instanceof Array;
  }

  isBoolean(o) {
    return typeof o === 'boolean' || o instanceof Boolean;
  }

  isObject(o) {
    return (typeof o === 'object' || o instanceof Object);
  }

  isValidArrayOrString(o) {
    const valid = !!o;
    const isString = this.isString(o);
    const isArray = this.isArray(o);

    if (isString && !valid && o === '') {
      return true;
    }
    return valid && (isArray || isString);
  }

  isValidObject(o) {
    return (!!o && this.isObject(o));
  }
}

module.exports = new Value();
