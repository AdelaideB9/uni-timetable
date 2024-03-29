const cookie = require("cookie");

exports.filterObjectKeys = function(obj, arr) {
  return Object.keys(obj)
    .filter(key => {
      for (const i in arr) {
        if (key.indexOf(arr[i]) > -1) return true;
      }
      return false;
    })
    .reduce((object, key) => {
      return {
        ...object,
        [key]: obj[key]
      };
    }, {});
};

exports.objectHasKeys = function(obj, arr) {
  for (const i in arr) {
    if (!exports.objectHasKey(obj, arr[i])) return false;
  }
  return true;
};

exports.objectHasKey = function(obj, str) {
  for (const val in obj) {
    if (val.indexOf(str) > -1) return true;
  }
  return false;
};

exports.objectToCookieString = function(cookies) {
  let cookieString = "";
  let i = 1;
  for (const val in cookies) {
    cookieString += cookie.serialize(val, cookies[val]);
    if (Object.keys(cookies).length != i) cookieString += "; ";

    i++;
  }
  return cookieString;
};

exports.angularDistance = function(a, b) {
  let phi = Math.abs(b - a) % 360;
  return phi > 180 ? 360 - phi : phi;
};

exports.to12HourTime = function(str) {
  let time = parseInt(str.split(":")[0]);
  return time >= 12
    ? String(((time - 1) % 12) + 1) + ":00pm"
    : String(time) + ":00am";
};
