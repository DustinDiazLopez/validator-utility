const validator = require('./validatorUtility').init();

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

test('test normal', () => {
  const date = new Date();
  const obj = {
    _id: new _IdExample('example'),
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
        date,
      },
    ],
  };
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

test('test bad string', () => {
  const date = new Date();
  const obj = JSON.stringify({
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
        date,
      },
    ],
  });
  const sanitized = validator.escape(obj);
  const expected = JSON.stringify({
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

test('test number', () => {
  const obj = 43892;
  const sanitized = validator.escape(obj);
  const expected = 43892;
  expect(sanitized).toEqual(expected);
});

test('test function', () => {
  const obj = (a, b) => a + b;
  const sanitized = validator.escape(obj);
  expect(sanitized(1, 1)).toEqual(2);
});
