/* eslint-disable class-methods-use-this */
const Check = require('./check');

class Utils {
  escape(str, ignore = []) {
    if (!Check.isString(str)) {
      throw new TypeError(
        'validator-utility - escape/escapeString expected a string but got',
        typeof str,
      );
    }

    if (!Check.isValidArrayOrString(ignore)) {
      ignore = [];
    }

    let result = str;
    if (!ignore.includes('&')) {
      result = result.replace(/&/g, '&amp;');
    }
    if (!ignore.includes('"')) {
      result = result.replace(/"/g, '&quot;');
    }
    if (!ignore.includes('\'')) {
      result = result.replace(/'/g, '&#x27;');
    }
    if (!ignore.includes('<')) {
      result = result.replace(/</g, '&lt;');
    }
    if (!ignore.includes('>')) {
      result = result.replace(/>/g, '&gt;');
    }
    if (!ignore.includes('/')) {
      result = result.replace(/\//g, '&#x2F;');
    }
    if (!ignore.includes('\\')) {
      result = result.replace(/\\/g, '&#x5C;');
    }
    if (!ignore.includes('`')) {
      result = result.replace(/`/g, '&#96;');
    }
    return result;
  }

  safeEscape(str, escapeFunction, unescapeFunction, ignore) {
    // string value may have already been escaped, which may cause other literals like
    // `<` to be re-escaped, for example, `<` turns into `&lt;` which if re-escaped
    // will turn into `&amp;lt`
    return escapeFunction(unescapeFunction(str), ignore);
  }
}

module.exports = new Utils();
