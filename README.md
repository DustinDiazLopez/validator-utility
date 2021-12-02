# Validator Utility

[![CI](https://circleci.com/gh/DustinDiazLopez/validator-utility.svg?style=svg)](https://circleci.com/gh/DustinDiazLopez/validator-utility)

This package expands the functionality of the `escape` method in the [validator](https://www.npmjs.com/package/validator) package.

It adds support for escaping string values in a JSON object, i.e., it'll escape all string values.

For example:

```js
const example = {
  id: 1,
  message: "Hello, <script>alert('world');</script>",
};

const sanitizedExample = validator.escape(example);
```

The value of `sanitizedExample` will be:

```js
{
  id: 1,
  message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
}
```

## Usage

**IMPORTANT**: only use for responses, i.e., this function may be destructive:

- If a key is named `_id` and its value is an `object` it'll try to do a `.toString()` on that value
- If a value is an `instanceof Date` it'll call `.toISOString()` on that date value

### Install and import package:

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

### Use additional functionality:
```js
const validator = require('validator-utility');
validator.configure(
  100, // max deep depth
  100, // max array depth
  true, // supress warrning about truncated object or unprocessed arrays
  ['/'], // values to NOT escape
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

## JSDoc
> **IMPORTANT:** if these depths are exceeded (1) objects will be _truncated_ and (2) arrays _will not_ be processed (i.e., an empty array will be returned).
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
