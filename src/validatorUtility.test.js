const toHave = Object.keys(require('validator'));

/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-lone-blocks */
/* eslint-disable global-require */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */

function main(id) {
  {
    const validator = require(id);
    escapeTestSuite(validator, 'export default');
  }

  {
    // support old way
    const validator = require(id).init();
    escapeTestSuite(validator, 'init()');
  }

  {
    const validator = require(id);
    escapeTestSuite(validator, 'export default');
    validator.configure(
      null, // max deep depth
      null, // max array depth
      null, // supress warrning about truncated object or unprocessed arrays
      null, // values to NOT escape
    );
  }

  {
    // support old way
    const validator = require(id).init();
    validator.configure(
      null, // max deep depth
      null, // max array depth
      null, // supress warrning about truncated object or unprocessed arrays
      null, // values to NOT escape
    );
    escapeTestSuite(validator, 'init()');
  }
}
class _IdExample {
  constructor(_id) {
    this._id = _id;
    this.date = new Date();
    this.foo = 'bar';
  }

  toString() {
    return this._id;
  }
}

function unsafeCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

const testObject = (date = new Date(), jsonString = false) => {
  const o = {
    _id: jsonString ? 'example' : new _IdExample('example'),
    people: [{
      id: 1,
      first_name: 'Jeanette',
      last_name: 'Penddreth',
      email: 'jpenddreth0@census.gov',
      gender: 'Female',
      ip_address: '26.58.193.2',
    }, {
      id: 2,
      first_name: 'Giavani',
      last_name: 'Frediani',
      email: 'gfrediani1@senate.gov',
      gender: 'Male',
      ip_address: '229.179.4.212',
    }, {
      id: 3,
      first_name: 'Noell',
      last_name: 'Bea',
      email: 'nbea2@imageshack.us',
      gender: 'Female',
      ip_address: '180.66.162.255',
    }, {
      id: 4,
      first_name: 'Willard',
      last_name: 'Valek',
      email: 'wvalek3@vk.com',
      gender: 'Male',
      ip_address: '67.76.188.26',
    }],
    messages: [
      {
        id: 1,
        message: "Hello, <script>alert('world');</script>",
        date: jsonString ? date.toISOString() : date,
      },
    ],
  };

  return jsonString ? JSON.stringify(o) : o;
};

function escapeTestSuite(validator, name = '') {
  describe(`validatorUtility - test escape ${name}`, () => {
    const warn = console.warn;
    beforeAll(() => {
      console.warn = jest.fn();
    });

    afterAll(() => {
      console.warn = warn;
    });

    test('custom validator inherited all functions', () => {
      toHave.forEach((key) => {
        expect(validator[key]).not.toBeUndefined();
      });
      expect(validator.configure).not.toBeUndefined();
      expect(validator.init).not.toBeUndefined();
      expect(validator.escape).not.toBeUndefined();
    });

    test('test normal', () => {
      const date = new Date();
      const obj = testObject(date);
      const sanitized = validator.escape(obj);
      const expected = {
        _id: 'example',
        people: [{
          id: 1,
          first_name: 'Jeanette',
          last_name: 'Penddreth',
          email: 'jpenddreth0@census.gov',
          gender: 'Female',
          ip_address: '26.58.193.2',
        }, {
          id: 2,
          first_name: 'Giavani',
          last_name: 'Frediani',
          email: 'gfrediani1@senate.gov',
          gender: 'Male',
          ip_address: '229.179.4.212',
        }, {
          id: 3,
          first_name: 'Noell',
          last_name: 'Bea',
          email: 'nbea2@imageshack.us',
          gender: 'Female',
          ip_address: '180.66.162.255',
        }, {
          id: 4,
          first_name: 'Willard',
          last_name: 'Valek',
          email: 'wvalek3@vk.com',
          gender: 'Male',
          ip_address: '67.76.188.26',
        }],
        messages: [
          {
            id: 1,
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    test('test normal 2', () => {
      const date = new Date();
      const obj = testObject(date);
      const sanitized = validator.escape(obj, 42, 42, false, ['<']);
      const expected = {
        _id: 'example',
        people: [{
          id: 1,
          first_name: 'Jeanette',
          last_name: 'Penddreth',
          email: 'jpenddreth0@census.gov',
          gender: 'Female',
          ip_address: '26.58.193.2',
        }, {
          id: 2,
          first_name: 'Giavani',
          last_name: 'Frediani',
          email: 'gfrediani1@senate.gov',
          gender: 'Male',
          ip_address: '229.179.4.212',
        }, {
          id: 3,
          first_name: 'Noell',
          last_name: 'Bea',
          email: 'nbea2@imageshack.us',
          gender: 'Female',
          ip_address: '180.66.162.255',
        }, {
          id: 4,
          first_name: 'Willard',
          last_name: 'Valek',
          email: 'wvalek3@vk.com',
          gender: 'Male',
          ip_address: '67.76.188.26',
        }],
        messages: [
          {
            id: 1,
            message: 'Hello, <script&gt;alert(&#x27;world&#x27;);<&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    test('test normal nulls', () => {
      const date = new Date();
      const obj = testObject(date);
      const sanitized = validator.escape(obj, null, null, null, null);
      const expected = {
        _id: 'example',
        people: [{
          id: 1,
          first_name: 'Jeanette',
          last_name: 'Penddreth',
          email: 'jpenddreth0@census.gov',
          gender: 'Female',
          ip_address: '26.58.193.2',
        }, {
          id: 2,
          first_name: 'Giavani',
          last_name: 'Frediani',
          email: 'gfrediani1@senate.gov',
          gender: 'Male',
          ip_address: '229.179.4.212',
        }, {
          id: 3,
          first_name: 'Noell',
          last_name: 'Bea',
          email: 'nbea2@imageshack.us',
          gender: 'Female',
          ip_address: '180.66.162.255',
        }, {
          id: 4,
          first_name: 'Willard',
          last_name: 'Valek',
          email: 'wvalek3@vk.com',
          gender: 'Male',
          ip_address: '67.76.188.26',
        }],
        messages: [
          {
            id: 1,
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    test('test normal (escape multiple times)', () => {
      const date = new Date();
      const obj = testObject(date);
      const sanitized = validator.escape(validator.escape(obj));
      const expected = {
        _id: 'example',
        people: [{
          id: 1,
          first_name: 'Jeanette',
          last_name: 'Penddreth',
          email: 'jpenddreth0@census.gov',
          gender: 'Female',
          ip_address: '26.58.193.2',
        }, {
          id: 2,
          first_name: 'Giavani',
          last_name: 'Frediani',
          email: 'gfrediani1@senate.gov',
          gender: 'Male',
          ip_address: '229.179.4.212',
        }, {
          id: 3,
          first_name: 'Noell',
          last_name: 'Bea',
          email: 'nbea2@imageshack.us',
          gender: 'Female',
          ip_address: '180.66.162.255',
        }, {
          id: 4,
          first_name: 'Willard',
          last_name: 'Valek',
          email: 'wvalek3@vk.com',
          gender: 'Male',
          ip_address: '67.76.188.26',
        }],
        messages: [
          {
            id: 1,
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    test('test example README w/ global config', () => {
      const input = {
        message: 'pong!',
        input: 'HELLO/WORLD <sneak>',
      };
      const sanitized = validator.escape(input);
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify({ message: 'pong!', input: 'HELLO&#x2F;WORLD &lt;sneak&gt;' }));
    });

    test('test bad string (json-str)', () => {
      const date = new Date();
      const obj = testObject(date, true);
      expect(typeof obj).toEqual('string');
      const sanitized = validator.escape(obj);
      const expected = JSON.stringify({
        _id: 'example',
        people: [{
          id: 1,
          first_name: 'Jeanette',
          last_name: 'Penddreth',
          email: 'jpenddreth0@census.gov',
          gender: 'Female',
          ip_address: '26.58.193.2',
        }, {
          id: 2,
          first_name: 'Giavani',
          last_name: 'Frediani',
          email: 'gfrediani1@senate.gov',
          gender: 'Male',
          ip_address: '229.179.4.212',
        }, {
          id: 3,
          first_name: 'Noell',
          last_name: 'Bea',
          email: 'nbea2@imageshack.us',
          gender: 'Female',
          ip_address: '180.66.162.255',
        }, {
          id: 4,
          first_name: 'Willard',
          last_name: 'Valek',
          email: 'wvalek3@vk.com',
          gender: 'Male',
          ip_address: '67.76.188.26',
        }],
        messages: [
          {
            id: 1,
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      });
      expect(typeof sanitized).toEqual('string');
      expect(sanitized).toEqual(expected);
    });

    test('test normal string', () => {
      const obj = "Hello, <script>alert('world');</script>";
      const sanitized = validator.escape(obj);
      const expected = 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;';
      expect(sanitized).toEqual(expected);
    });

    test('test blacklist directly blacklist array', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should not be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escapeString(obj, ['/']);
      const expected = `Hello, &lt;script&gt;
      // this comment should not be escaped
      alert(&#x27;world&#x27;);
      &lt;/script&gt;`;
      expect(sanitized).toEqual(expected);
    });

    test('test blacklist directly blacklist string', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should not be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escapeString(obj, '/');
      const expected = `Hello, &lt;script&gt;
      // this comment should not be escaped
      alert(&#x27;world&#x27;);
      &lt;/script&gt;`;
      expect(sanitized).toEqual(expected);
    });

    test('test blacklist empty', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escapeString(obj, '');
      const expected = `Hello, &lt;script&gt;
      &#x2F;&#x2F; this comment should be escaped
      alert(&#x27;world&#x27;);
      &lt;&#x2F;script&gt;`;
      expect(sanitized).toEqual(expected);
    });

    test('test blacklist undefined', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escapeString(obj);
      const expected = `Hello, &lt;script&gt;
      &#x2F;&#x2F; this comment should be escaped
      alert(&#x27;world&#x27;);
      &lt;&#x2F;script&gt;`;
      expect(sanitized).toEqual(expected);
    });

    test('test blacklist through escape', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should not be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escape(obj, Infinity, Infinity, true, ['/']);
      const expected = `Hello, &lt;script&gt;
      // this comment should not be escaped
      alert(&#x27;world&#x27;);
      &lt;/script&gt;`;
      expect(sanitized).toEqual(expected);
    });

    test('test number', () => {
      const obj = 43892;
      const sanitized = validator.escape(obj);
      const expected = 43892;
      expect(typeof sanitized).toEqual('number');
      expect(sanitized).toEqual(expected);
    });

    test('test boolean', () => {
      const obj = false;
      const sanitized = validator.escape(obj);
      const expected = false;
      expect(typeof sanitized).toEqual('boolean');
      expect(sanitized).toEqual(expected);
    });

    test('test function', () => {
      const obj = (a, b) => a + b;
      const sanitizedFunction = validator.escape(obj);
      expect(typeof sanitizedFunction).toEqual('function');
      expect(sanitizedFunction(1, 1)).toEqual(2);
    });

    test('test max array depth', () => {
      const date = new Date();
      const obj = testObject(date);
      for (let i = 0; i < 50; i++) {
        obj.people.push(obj.people[0]);
      }

      const sanitized = validator.escape(obj, -1, 5, true);
      const expected = {
        _id: 'example',
        people: [],
        messages: [
          {
            id: 1,
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    test('test max deep depth', () => {
      const date = new Date();
      const obj = testObject(date);

      let ref = obj.people[0];
      for (let i = 0; i < 50; i++) {
        ref.people = [];
        ref.people.push(unsafeCopy(obj.people[0]));
        ref = ref.people[0];
      }

      const MAX_DEEP_DEPTH = 5;
      const sanitized = validator.escape(obj, MAX_DEEP_DEPTH, 50, true);

      let count = 1;
      ref = sanitized.people[0];
      for (let i = 0; i < 50; i++) {
        if (ref && ref.people && ref.people[0]) {
          count++;
          ref = ref.people[0];
        } else {
          break;
        }
      }
      expect(count).toEqual(MAX_DEEP_DEPTH);
    });

    test('test normal 0 max depths', () => {
      const date = new Date();
      const obj = testObject(date);
      const sanitized = validator.escape(obj, 0, 0);
      const expected = {
        _id: 'example',
        people: [{
          id: 1,
          first_name: 'Jeanette',
          last_name: 'Penddreth',
          email: 'jpenddreth0@census.gov',
          gender: 'Female',
          ip_address: '26.58.193.2',
        }, {
          id: 2,
          first_name: 'Giavani',
          last_name: 'Frediani',
          email: 'gfrediani1@senate.gov',
          gender: 'Male',
          ip_address: '229.179.4.212',
        }, {
          id: 3,
          first_name: 'Noell',
          last_name: 'Bea',
          email: 'nbea2@imageshack.us',
          gender: 'Female',
          ip_address: '180.66.162.255',
        }, {
          id: 4,
          first_name: 'Willard',
          last_name: 'Valek',
          email: 'wvalek3@vk.com',
          gender: 'Male',
          ip_address: '67.76.188.26',
        }],
        messages: [
          {
            id: 1,
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;&#x2F;script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    describe('escapeString and unescapeString', () => {
      const safeEscape = (str) => (
        validator.escapeString(validator.unescapeString(str))
      );

      const input = `${`<script>
      alert('Hello, world!');
      alert("Hello, world!");
      // comment
      /* comment \\ */
      const str = '/"&&"/'
      const re = /hello/gi;
    </script>`.trim()}<script>alert(\`Hello, world!\`);<script>`;

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
}

main('./validatorUtility');
main('../build/node/10.4/validatorUtility');
