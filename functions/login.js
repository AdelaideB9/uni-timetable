const axios = require('axios')
const cookie = require('cookie')
const util = require('util')

function filterObjectByArray(obj, arr) {
	return Object.keys(obj)
		.filter(key => { 
			found = false
			for (val in arr) { if(key.indexOf(arr[val]) > -1) found = true }
			return found
		}).reduce((object, key) => {
			return {
				...object,
				[key]: obj[key]
			}
		}, {})
}

function objectToCookieString(cookies) {
	let cookieString = ""
	let i = 1
	for (val in cookies) {
		cookieString += cookie.serialize(val, cookies[val])
		if(Object.keys(cookies).length != i)
			cookieString += '; '
		
		i++
	}
	return cookieString
}

exports.handler = async (event, context) => {
  try {
	let cookies = {}
	const cookieFilter = ['ASPSESSIONID', 'CS92AA']
	if (event.headers.cookie) {
		cookies = cookie.parse(event.headers.cookie)
		cookies = filterObjectByArray(cookies, cookieFilter)
	}
	
	let cookieString = objectToCookieString(cookies)
	  
    const username = event.queryStringParameters.username
	const password = event.queryStringParameters.password
	
	if (!username || !password) throw Error("Did not supply username and password")
	
	const data = new URLSearchParams()
	data.append('UID', username)
	data.append('PASS', password)
	
	const config = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Referer': 'https://access.adelaide.edu.au/sa/',
			'Cookie': cookieString
		}
	}
		
	res = await axios.post('https://access.adelaide.edu.au/sa/login.asp', data, config)
	
	if(!res.request._redirectable._isRedirect) {
		// Did not redirect, meaning we did not successfully log in
		throw Error("Failed to login, check username and password")
	}
	
	let result = {
      statusCode: 200,
      body: `Logged in with user ${username}`,
      headers: {}
    }
	
	if (res.headers['set-cookie']) { 
		result.headers['set-cookie'] = res.headers['set-cookie'].map(val => {
			let thecookie = Object.entries(cookie.parse(val))[0]
			return cookie.serialize(thecookie[0], thecookie[1])
		})
	}
	
    return result
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
