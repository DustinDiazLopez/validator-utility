# Validator Utility

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

> **IMPORTANT**: only use for responses, i.e., this function may be destructive:
>
> - If a key is named `_id` and it's an object it'll try to do a `.toString()` on that value
> - If a value is an `instanceof Date` it'll call `.toISOString()` on that date value

Install and import package:

```js
const validator = require('validator-utility').init();

// ...

app.post('/ping', (req, res) => {
  const example = {
    message: 'pong!',
    input: req.body.comment,
  };
  // ...
  const sanitizedResponse = validator.escape(example);
  return res.send(sanitizedResponse);
});
```

## JSDoc

```ts
/**
 * Replace `<`, `>`, `&`, `'`, `"` and `/` in every value inside an object
 * @param {any} obj the object/string to sanitize. Required. 
 * @param {number} maxDeepDepth maximum allowed recursion depth. `Infinity` by default.
 * @param {number} maxArrayDepth maximing allowed array size (depth). `Infinity` by default.
 * @param {boolean} supressWarnings wether to `console.warn` when an array/object exceeded
 *                                  the max depth. `false` by default.
 * @returns the sanitized object/string. If the input is not a string or an object
 *          it'll be returned.
 */
validator.escape(obj, maxDeepDepth?: number, maxArrayDepth?: number, supressWarnings?: boolean);
```

For documentation on other `validator` methods refer to the [validator](https://www.npmjs.com/package/validator) package README.
