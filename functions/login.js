const axios = require("axios");
const cookie = require("cookie");
const common = require("../common.js");
const qs = require("querystring");

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod != "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const params = qs.parse(event.body);
    const username = params.username;
    const password = params.password;

    if (!username || !password)
      throw Error("Did not supply username and password");

    let result = {
      statusCode: 200,
      body: `Logged in with user ${username}`,
      multiValueHeaders: {
        "set-cookie": []
      }
    };

    let cookies = {};
    const cookieFilter = ["ASPSESSIONID", "CS92AA"];
    if (event.headers.cookie) {
      cookies = cookie.parse(event.headers.cookie);
      cookies = common.filterObjectKeys(cookies, cookieFilter);
    }

    if (Object.keys(cookies).length != 0) {
      // We need to clear out any old cookies
      for (const val in cookies) {
        result.multiValueHeaders["set-cookie"].push(
          cookie.serialize(val, cookies[val], {
            expires: new Date(),
            path: "/"
          })
        );
      }
      cookies = {};
    }

    const data = qs.stringify({ UID: username, PASS: password });

    var config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: "https://access.adelaide.edu.au/sa/"
      },
      maxRedirects: 0,
      validateStatus: status => {
        return status >= 200 && status < 303;
      }
    };

    let res = await axios.post(
      "https://access.adelaide.edu.au/sa/login.asp",
      data,
      config
    );

    if (
      res.headers.location != "https://access.adelaide.edu.au/sa/init.asp" ||
      !res.headers["set-cookie"]
    ) {
      // Did not redirect to dashboard, meaning we did not successfully log in
      throw Error("Failed to login, check username and password");
    }

    result.multiValueHeaders["set-cookie"] = result.multiValueHeaders[
      "set-cookie"
    ].concat(
      res.headers["set-cookie"].map(val => {
        let thecookie = Object.entries(cookie.parse(val))[0];
        cookies[thecookie[0]] = thecookie[1];
        return cookie.serialize(thecookie[0], thecookie[1], { path: "/" });
      })
    );

    config.headers["Cookie"] = common.objectToCookieString(cookies);
    res = await axios.get("https://access.adelaide.edu.au/sa/init.asp", config);

    return result;
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
