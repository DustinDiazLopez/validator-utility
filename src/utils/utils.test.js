/* eslint-disable no-useless-concat */
const validator = require('validator');
const Utils = require('./utils');

describe('utils', () => {
  const input = `${`<script>
      alert('Hello, world!');
      alert("Hello, world!");
      // comment
      /* comment \\ */
      const str = '/"&&"/'
      const re = /hello/gi;
    </script>`.trim()}<script>alert(\`Hello, world!\`);<script>`;
  describe('escape', () => {
    test('should escape string should return string', () => {
      const result = Utils.escape(input);
      expect(result).toBeTruthy();
      expect(typeof result).toEqual('string');
    });

    test('should throw TypeError exception', () => {
      expect(() => {
        Utils.escape(null);
      }).toThrow(TypeError);
      expect(() => {
        Utils.escape(42);
      }).toThrow(TypeError);
      expect(() => {
        Utils.escape(() => {});
      }).toThrow(TypeError);
      expect(() => {
        Utils.escape({});
      }).toThrow(TypeError);
      expect(() => {
        Utils.escape(true);
      }).toThrow(TypeError);
    });

    test('should escape string (no ignores)', () => {
      const result = Utils.escape(input);
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (null ignores)', () => {
      const result = Utils.escape(input, null);
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (empty string ignores)', () => {
      const result = Utils.escape(input, '');
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (number ignores)', () => {
      const result = Utils.escape(input, 42);
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (empty string object ignores)', () => {
      // eslint-disable-next-line no-new-wrappers
      const result = Utils.escape(input, new String(''));
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (ignore &)', () => {
      const result = Utils.escape(input, ['&']);
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&&&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
    test('should escape string (ignore /)', () => {
      const result = Utils.escape(input, ['/']);
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      // comment
      /* comment &#x5C; */
      const str = &#x27;/&quot;&amp;&amp;&quot;/&#x27;
      const re = /hello/gi;
    &lt;/script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (ignore ")', () => {
      const result = Utils.escape(input, '"');
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert("Hello, world!");
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;"&amp;&amp;"&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (should ignore \')', () => {
      const result = Utils.escape(input, '\'');
      const expected = `${`
      &lt;script&gt;
      alert('Hello, world!');
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = '&#x2F;&quot;&amp;&amp;&quot;&#x2F;'
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (should ignore <)', () => {
      const result = Utils.escape(input, ['<']);
      const expected = `${`
      <script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    <&#x2F;script&gt;`.trim()}<script&gt;alert(&#96;Hello, world!&#96;);<script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (should ignore >)', () => {
      const result = Utils.escape(input, '>');
      const expected = `${`
      &lt;script>
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script>`.trim()}&lt;script>alert(&#96;Hello, world!&#96;);&lt;script>`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (should ignore \\)', () => {
      const result = Utils.escape(input, ['\\']);
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment \\ *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });

    test('should escape string (should ignore `)', () => {
      const result = Utils.escape(input, '`');
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(\`Hello, world!\`);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
  });

  describe('safeEscape', () => {
    const safeEscape = (str, ignore = []) => (
      Utils.safeEscape(str, validator.escape, validator.unescape, ignore)
    );

    test('should escape string should return string', () => {
      const result = safeEscape(input);
      expect(result).toBeTruthy();
      expect(typeof result).toEqual('string');
    });

    test('escapes the string properly even when called multiple times', () => {
      const result = safeEscape(safeEscape(input));
      const expected = `${`
      &lt;script&gt;
      alert(&#x27;Hello, world!&#x27;);
      alert(&quot;Hello, world!&quot;);
      &#x2F;&#x2F; comment
      &#x2F;* comment &#x5C; *&#x2F;
      const str = &#x27;&#x2F;&quot;&amp;&amp;&quot;&#x2F;&#x27;
      const re = &#x2F;hello&#x2F;gi;
    &lt;&#x2F;script&gt;`.trim()}&lt;script&gt;alert(&#96;Hello, world!&#96;);&lt;script&gt;`;
      expect(result).toBeTruthy();
      expect(result).toEqual(expected);
    });
  });
});
