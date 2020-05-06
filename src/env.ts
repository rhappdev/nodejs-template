
exports.get = get;
exports.set = set;
const def = {
  'LOG_LEVEL': 'info',
  'CORS' : '*'
};

const dynamic = {

};

export function get(key) {
  return typeof dynamic[key] !== 'undefined' ?
    dynamic[key] :
    typeof process.env[key] !== 'undefined' ? process.env[key] : def[key];
}
export function set(key, val) {
  dynamic[key] = val;
}

export function checkEnv() {
  const log = require('./log').default;
  for (const key in def) {
    if (process.env[key] === undefined) {
      log.warn(`Env var ${key} is not set. Default will be used: ${def[key]}`);
    }
  }
}
