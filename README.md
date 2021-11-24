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

Install and import package:

```js
const validator = require('validator-utility').init();

// ...

app.post('/ping', () => {
  const example = {
    message: 'pong!',
  };
  // ...
  const sanitizedResponse = validator.escape(example);
  return res.send(sanitizedResponse);

});
```

