/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable global-require */
function main(id) {
  {
    const validator = require(id);
    validator.config({
      maxDeepDepth: 100,
      maxArrayDepth: 100,
      suppressWarnings: false,
      ignore: ['/'],
      truncateArray: true,
    });
    configuredEscapeTestSuite(validator, 'export default w/ configure and truncate');
  }

  {
    // support old way
    const validator = require(id).init();
    validator.config({
      maxDeepDepth: 100,
      maxArrayDepth: 100,
      suppressWarnings: false,
      ignore: ['/'],
      truncateArray: true,
    });
    configuredEscapeTestSuite(validator, 'init() w/ configure and truncate');
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

function configuredEscapeTestSuite(validator, name = '') {
  describe(`test escape ${name}`, () => {
    const warn = console.warn;
    beforeAll(() => {
      console.warn = jest.fn();
    });

    afterAll(() => {
      console.warn = warn;
    });

    test('validatorUtility - test normal', () => {
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
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;/script&gt;',
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
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify({ message: 'pong!', input: 'HELLO/WORLD &lt;sneak&gt;' }));
    });

    test('test example README w/ global config null', () => {
      const input = null;
      const sanitized = validator.escape(input);
      expect(sanitized).toEqual(null);
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
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;/script&gt;',
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
      const expected = 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;/script&gt;';
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

    test('test blacklist w/ global config', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escapeString(obj);
      const expected = `Hello, &lt;script&gt;
      // this comment should be escaped
      alert(&#x27;world&#x27;);
      &lt;/script&gt;`;
      expect(sanitized).toEqual(expected);
    });

    test('test blacklist through escape', () => {
      // eslint-disable-next-line quotes
      const obj = `Hello, <script>
      // this comment should not be escaped
      alert('world');
      </script>`;
      const sanitized = validator.escape(obj);
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

    test('test max deep depth w/ global config', () => {
      const date = new Date();
      const obj = testObject(date);

      let ref = obj.people[0];
      for (let i = 0; i < 123; i++) {
        ref.people = [];
        ref.people.push(unsafeCopy(obj.people[0]));
        ref = ref.people[0];
      }

      const sanitized = validator.escape(obj);

      let count = 1;
      ref = sanitized.people[0];
      for (let i = 0; i < 123; i++) {
        if (ref && ref.people && ref.people[0]) {
          count++;
          ref = ref.people[0];
        } else {
          break;
        }
      }
      expect(count).toEqual(100);
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
            message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;/script&gt;',
            date: date.toISOString(),
          },
        ],
      };
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
    });

    test('test normal override the global config', () => {
      const input = {
        example: 'COMPANY>STUDIO',
      };
      const sanitized = validator.escape(input, Infinity, Infinity, true, ['>']);
      expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(input));
    });
  });

  test('test max array depth', () => {
    const date = new Date();
    const obj = testObject(date);
    for (let i = 0; i < 150; i++) {
      obj.people.push(obj.people[0]);
    }

    let expectedArray = unsafeCopy(obj.people);
    expectedArray = expectedArray.splice(0, 5);

    const sanitized = validator.escape(obj, -1, 5, true, ['/'], true);
    const expected = {
      _id: 'example',
      people: expectedArray,
      messages: [
        {
          id: 1,
          message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;/script&gt;',
          date: date.toISOString(),
        },
      ],
    };
    expect(sanitized.people.length).toEqual(expected.people.length);
    expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
  });

  test('test max array depth w/ global config', () => {
    const date = new Date();
    const obj = testObject(date);
    for (let i = 0; i < 500; i++) {
      obj.people.push(obj.people[0]);
    }

    let expectedArray = unsafeCopy(obj.people);
    expectedArray = expectedArray.splice(0, 100);

    const sanitized = validator.escape(obj);
    const expected = {
      _id: 'example',
      people: expectedArray,
      messages: [
        {
          id: 1,
          message: 'Hello, &lt;script&gt;alert(&#x27;world&#x27;);&lt;/script&gt;',
          date: date.toISOString(),
        },
      ],
    };
    expect(sanitized.people.length).toEqual(expected.people.length);
    expect(JSON.stringify(sanitized)).toEqual(JSON.stringify(expected));
  });
}

main('./validatorUtility');
main('../build/node/10.4/validatorUtility');
