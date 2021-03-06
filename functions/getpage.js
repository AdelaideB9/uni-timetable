const axios = require("axios");
const cookie = require("cookie");
const common = require("../common.js");

exports.handler = async (event, context) => {
  try {
    let cookies = {};
    const cookieFilter = ["ASPSESSIONID", "CS92AA"];
    if (event.headers.cookie) {
      cookies = cookie.parse(event.headers.cookie);
      cookies = common.filterObjectKeys(cookies, cookieFilter);
    }

    if (!common.objectHasKeys(cookies, cookieFilter))
      throw Error("Missing cookies, you need to log in first");

    let cookieString = common.objectToCookieString(cookies);

    let url = event.queryStringParameters.url;

    if (!url) throw Error("Did not supply URL");

    const config = {
      headers: {
        Referer: "https://access.adelaide.edu.au/sa/",
        Cookie: cookieString
      }
    };

    let res = await axios.get(
      "https://access.adelaide.edu.au/sa/" + url,
      config
    );

    if (
      res.request.res.responseUrl ==
      "https://access.adelaide.edu.au/sa/login.asp"
    ) {
      // Did not redirect to dashboard, meaning we are not logged in
      throw Error("Redirected, you are not logged in");
    }

    if (res.data.indexOf("An error occurred") > -1) {
      // Some error occured on Access Adelaide
      throw Error("Generic error, clear your cookies");
    }

    let result = {
      statusCode: 200,
      body: res.data
    };

    return result;
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
