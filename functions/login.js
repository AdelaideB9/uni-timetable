const axios = require("axios");
const cheerio = require("cheerio");
const cookie = require("cookie");

exports.handler = async (event, _context) => {
  try {
    if (event.httpMethod != "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const params = new URLSearchParams(event.body);
    const username = params.get("username");
    const password = params.get("password");

    if (!username || !password)
      throw Error("Did not supply username and password");

    var config = {
      maxRedirects: 0,
      validateStatus: status => {
        return status >= 200 && status < 303;
      }
    };

    let loginreq = await axios.get("https://tt.openshift.services.adelaide.edu.au/login");
    let url = loginreq.request.res.responseUrl;
    console.log("Responding to " + url);

    let samlreq1 = await axios.post(
      url,
      new URLSearchParams({ UserName: "uofa\\" + username, Password: password, AuthMethod: "FormsAuthentication" }),
      config
    );

    if (!samlreq1.headers["set-cookie"]) {
      throw Error("Failed to login, check username and password");
    }

    let samlreq2 = await axios.get(samlreq1.headers.location, { headers: { cookie: samlreq1.headers["set-cookie"] } });
    const $ = cheerio.load(samlreq2.data);
    const form = $("form");
    const samlresponse = $("form > input");

    let callback = await axios.post(form.attr("action"), new URLSearchParams({ SAMLResponse: samlresponse.attr("value") }), config);

    if (!callback.headers["set-cookie"]) {
      throw Error("Failed to login, check username and password");
    }

    let result = {
      statusCode: 200,
      body: `Logged in with user ${username}`,
      multiValueHeaders: {
        "set-cookie": []
      }
    };

    result.multiValueHeaders["set-cookie"] =
      callback.headers["set-cookie"].map(val => {
        let thecookie = Object.entries(cookie.parse(val))[0];
        return cookie.serialize(thecookie[0], thecookie[1], { path: "/" });
      });

    return result;
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
};
