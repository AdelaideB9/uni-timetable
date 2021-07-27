const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cookie = require("cookie");
const common = require("../common.js");

var app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post("/api/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

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

    let cookies =
      callback.headers["set-cookie"].map(val => {
        let thecookie = Object.entries(cookie.parse(val))[0];
        return cookie.serialize(thecookie[0], thecookie[1], { path: "/" });
      });

    res.append("set-cookie", cookies);
    res.send(`Logged in with user ${username}`);

  } catch (err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
});

app.get("/api/timetable", async (req, res) => {
  try {
    console.log(req.headers.cookie)
    let cookies = {};
    const cookieFilter = ["connect.sid", "b47ab3a02bf2798d4506d9bb5a377bde"];
    if (req.headers.cookie) {
      cookies = cookie.parse(req.headers.cookie);
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

    let result = await axios.get("https://tt.openshift.services.adelaide.edu.au/api/timetable", config);

    if (result.status != 200) {
      throw Error("You are not logged in");
    }

    res.send(JSON.stringify(result.data))

  } catch (err) {
    console.log(err);
    res.status(500).send(err.toString());
  }
});

app.listen(8003);
