# Validator Utility

[![CI](https://circleci.com/gh/DustinDiazLopez/validator-utility.svg?style=svg)](https://circleci.com/gh/DustinDiazLopez/validator-utility)

This package expands upon the functionality of the `escape` method in the [validator](https://www.npmjs.com/package/validator) package. It adds support for escaping string values in a JSON object, i.e., it'll escape all string values.

**IMPORTANT**: only use for responses, i.e., this function may be *destructive*:

- If a key is named `_id` and its value is an `object` it'll try to do a `.toString()` on that value
- If a value is an `instanceof Date` it'll call `.toISOString()` on that date value.

## Install

Install/Update package (use `1.1.1`) with:

```bash
npm i validator-utility
```

Or download the [standalone file (node10.4+)](./build/node/10.4/validatorUtility.js)

## Usage

```js
const validator = require('validator-utility');
// NOTE: if the following depths are exceeded:
//  (1) objects will be truncated, and 
//  (2) arrays will not be processed (i.e., an empty array will be returned -- unless `truncateArray` is set to true).
validator.config({
  maxDeepDepth: 100,        // max deep depth (can be Infinity - default)
  maxArrayDepth: 100,       // max array depth (can be Infinity - default)
  suppressWarnings: false,  // supress warrning about truncated object or unprocessed arrays (false - default)
  ignore: [ '/' ],          // values to NOT escape (can be an empty array - default)
  truncateArray: false,     // if true process array but if maxArrayDepth is exceeded truncate (if set to false the array WILL NOT be processed - default)
});

// ...

app.post('/ping', (req, res) => {
  const example = {
    message: 'pong!',
    input: req.body.comment, // input: 'HELLO/WORLD <sneak>'
  };
  // ...
  const sanitizedResponse = validator.escape(example);
  return res.send(sanitizedResponse); // { message: 'pong!', input: 'HELLO/WORLD &lt;sneak&gt;'}
});
```

### Types

```ts
declare module 'validator-utility' {
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
  export function escape<T>(
    obj: T,
    maxDeepDepth?: number,
    maxArrayDepth?: number,
    supressWarnings?: boolean,
    ignore?: string[] | string,
    truncateArray?: boolean,
  ): T;

  export type ValidatoUtilityOptions = {
    maxDeepDepth?: number,
    maxArrayDepth?: number,
    supressWarnings?: boolean,
    ignore?: string[] | string,
    truncateArray?: boolean,
  };

  export function config(options: ValidatoUtilityOptions): void;

  /**
   * Configures the member vairables:
   * @param {number} maxDeepDepth maximum allowed recursion depth.
   *                                        `Infinity` by default.
   * @param {number} maxArrayDepth maximing allowed array size (depth).
   *                                         `Infinity` by default.
   * @param {boolean} supressWarnings wether to `console.warn` when an
   *                                            array/object exceeded the max depth.
   *                                            `false` by default.
   * @param {string[]|string} blacklist a list of characters to NOT escape.
   */
  export function configure(
    maxDeepDepth?: number,
    maxArrayDepth?: number,
    supressWarnings?: boolean,
    ignore?: string[] | string,
    truncateArray?: boolean,
  ): void;
}

```

For documentation on other `validator` methods refer to the [validator](https://www.npmjs.com/package/validator)'s documentation.

### Example I/O

```js
const input = '{ "message": "<sneak>" }'; // json string
// const output = validator.escape(input);
const output = '{ "message": "&lt;sneak&gt;" }'; // will return json string with appropriate values sanitized
```

```js
const input = { message: '<sneak>' }; // object
// const output = validator.escape(input);
const output = { message: '&lt;sneak&gt;' }; // will return object with appropriate values sanitized
```

```js
const input = [ { message: '<sneak>' }, ... ]; // arrays
// const output = validator.escape(input);
const output = [ { message: '&lt;sneak&gt;' }, ... ]; // will return array with appropriate values sanitized
```

```js
const input = { _id: [Object] }; // objects with _id
// const output = validator.escape(input);
const output = { _id: 'id-...' }; // will call .toString() on the value of _id
```

```js
const input = { date: new Date() }; // date
// const output = validator.escape(input);
const output = { date: '2021-12-04T10:35:06.353Z' }; // will return the date as an ISO string
```

```js
const input = (a, b) => a + b; // function
// const output = validator.escape(input);
const output = (a, b) => a + b; // will return the function (same applies for things that are not objects or strings)
```
