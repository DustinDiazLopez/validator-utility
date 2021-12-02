# Validator Utility

[![CI](https://circleci.com/gh/DustinDiazLopez/validator-utility.svg?style=svg)](https://circleci.com/gh/DustinDiazLopez/validator-utility)

This package expands upon the functionality of the `escape` method in the [validator](https://www.npmjs.com/package/validator) package. It adds support for escaping string values in a JSON object, i.e., it'll escape all string values.

**IMPORTANT**: only use for responses, i.e., this function may be *destructive*:

- If a key is named `_id` and its value is an `object` it'll try to do a `.toString()` on that value
- If a value is an `instanceof Date` it'll call `.toISOString()` on that date value.

## Usage

```js
const validator = require('validator-utility');
// NOTE: if the following depths are exceeded:
//  (1) objects will be truncated, and 
//  (2) arrays will not be processed (i.e., an empty array will be returned).
validator.configure(
  100, // max deep depth (can be Infinity)
  100, // max array depth (can be Infinity)
  true, // supress warrning about truncated object or unprocessed arrays
  ['/'], // values to NOT escape (can be an empty array)
);

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

### No Configure

```js
const validator = require('validator-utility');

// ...

app.post('/ping', (req, res) => {
  const example = {
    message: 'pong!',
    input: req.body.comment, // input: 'HELLO/WORLD <sneak>'
  };
  // ...
  const sanitizedResponse = validator.escape(example);
  return res.send(sanitizedResponse);  // { message: 'pong!', input: 'HELLO&#x2F;WORLD &lt;sneak&gt;'}
});
```

## JSDoc

```ts
/**
 * Replace `<`, `>`, `&`, `'`, `"` and `/` in every value inside an object/array/string
 * @param {any} obj the object/string to sanitize. Required.
 * @param {number} maxDeepDepth maximum allowed recursion depth.
 *                                        `Infinity` by default.
 * @param {number} maxArrayDepth maximing allowed array size (depth).
 *                                         `Infinity` by default.
 * @param {boolean} supressWarnings wether to `console.warn` when an
 *                                            array/object exceeded the max depth.
 *                                            `false` by default.
 * @param {string[]|string} blacklist a list of characters to NOT escape.
 * @returns the sanitized object/string. If the input is not a string or an object
 *          it'll be returned. If a JSON-String is inputed it'll parse it and return it back
 *          as a JSON-String (with the appropriate values sanitized).
 */
validator.escape(
  obj,
  maxDeepDepth?: number,
  maxArrayDepth?: number,
  supressWarnings?: boolean,
  blacklist?: string[] | string,
);
```

For documentation on other `validator` methods refer to the [validator](https://www.npmjs.com/package/validator)'s documentation.
