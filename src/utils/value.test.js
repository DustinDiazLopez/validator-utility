/* eslint-disable no-new-object */
/* eslint-disable no-array-constructor */
/* eslint-disable no-new-wrappers */
const Check = require('./value');

describe('check', () => {
  describe('isNumber', () => {
    test('should return true for explicit int', () => {
      const value = 48;
      const result = Check.isNumber(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for explicit float', () => {
      const value = 48.0;
      const result = Check.isNumber(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for Infinity', () => {
      const value = Infinity;
      const result = Check.isNumber(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for number object', () => {
      const value = new Number();
      const result = Check.isNumber(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return false for string', () => {
      const value = '';
      const result = Check.isNumber(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for string object', () => {
      const value = new String('hello');
      const result = Check.isNumber(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for array', () => {
      const value = [];
      const result = Check.isNumber(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });
  describe('isString', () => {
    test('should return true for string', () => {
      const value = 'this is a string';
      const result = Check.isString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for object string', () => {
      const value = new String('this is a string');
      const result = Check.isString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return false for object', () => {
      const value = {};
      const result = Check.isString(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for array', () => {
      const value = [];
      const result = Check.isString(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for object array', () => {
      const value = new Array();
      const result = Check.isString(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });
  describe('isArray', () => {
    test('should return true for array', () => {
      const value = [];
      const result = Check.isArray(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for array object', () => {
      const value = new Array();
      const result = Check.isArray(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return false for string', () => {
      const value = '';
      const result = Check.isArray(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
    test('should return false for string object', () => {
      const value = new String('asd');
      const result = Check.isArray(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });

  describe('isBoolean', () => {
    test('should return true for true', () => {
      const value = true;
      const result = Check.isBoolean(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for false', () => {
      const value = false;
      const result = Check.isBoolean(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for boolean object', () => {
      const value = new Boolean('true');
      const result = Check.isBoolean(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for boolean object', () => {
      const value = new Boolean('false');
      const result = Check.isBoolean(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return false for string', () => {
      const value = '';
      const result = Check.isBoolean(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
    test('should return false for string object', () => {
      const value = new String('asd');
      const result = Check.isBoolean(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
    test('should return false for undefined', () => {
      const value = undefined;
      const result = Check.isBoolean(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for null', () => {
      const value = null;
      const result = Check.isBoolean(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for a number', () => {
      const value = 42;
      const result = Check.isBoolean(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });

  describe('isObject', () => {
    test('should return true for object', () => {
      const value = {};
      const result = Check.isValidObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for object constructor', () => {
      const value = new Object('asdf');
      const result = Check.isValidObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for string object', () => {
      const value = new String('asdf');
      const result = Check.isObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return false for undefined', () => {
      const value = undefined;
      const result = Check.isObject(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return true for null', () => {
      const value = null;
      const result = Check.isObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return false for a number', () => {
      const value = 42;
      const result = Check.isObject(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for a string', () => {
      const value = 'not an object';
      const result = Check.isObject(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });

  describe('isValidArrayOrString', () => {
    test('should return true for array', () => {
      const value = [];
      const result = Check.isValidArrayOrString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for array object', () => {
      const value = new Array();
      const result = Check.isValidArrayOrString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for empty string', () => {
      const value = '';
      const result = Check.isValidArrayOrString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for string', () => {
      const value = 'asdf';
      const result = Check.isValidArrayOrString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return true for string object', () => {
      const value = new String('asdf');
      const result = Check.isValidArrayOrString(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return false for undefined', () => {
      const value = undefined;
      const result = Check.isValidArrayOrString(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for null', () => {
      const value = null;
      const result = Check.isValidArrayOrString(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for a number', () => {
      const value = 42;
      const result = Check.isValidArrayOrString(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });

  describe('isValidObject', () => {
    test('should return true for object', () => {
      const value = {};
      const result = Check.isValidObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for object constructor', () => {
      const value = new Object('asdf');
      const result = Check.isValidObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should return true for string object', () => {
      const value = new String('asdf');
      const result = Check.isValidObject(value);
      const expected = true;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should return false for undefined', () => {
      const value = undefined;
      const result = Check.isValidObject(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for null', () => {
      const value = null;
      const result = Check.isValidObject(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });

    test('should return false for a number', () => {
      const value = 42;
      const result = Check.isValidObject(value);
      const expected = false;
      expect(result).toBeFalsy();
      expect(result).toEqual(expected);
    });
  });
});
