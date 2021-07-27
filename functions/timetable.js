const axios = require("axios");
const cookie = require("cookie");
const common = require("../common.js");

exports.handler = async (event, context) => {
  try {
    console.log(event.headers.cookie)
    let cookies = {};
    const cookieFilter = ["connect.sid", "b47ab3a02bf2798d4506d9bb5a377bde"];
    if (event.headers.cookie) {
      cookies = cookie.parse(event.headers.cookie);
      cookies = common.filterObjectKeys(cookies, cookieFilter);
    }

    if (!common.objectHasKeys(cookies, cookieFilter))
      throw Error("Missing cookies, you need to log in first");

    let cookieString = common.objectToCookieString(cookies);

    var config = {
      headers: {
        cookie: cookieString
      },
      maxRedirects: 0,
      validateStatus: status => {
        return status >= 200 && status < 303;
      }
    };

    let res = await axios.get("https://tt.openshift.services.adelaide.edu.au/api/timetable", config);

    if (res.status != 200) {
      throw Error("You are not logged in");
    }

    let result = {
      statusCode: 200,
      body: JSON.stringify(res.data)
    };

    return result;
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
