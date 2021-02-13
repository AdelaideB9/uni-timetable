const axios = require('axios')
const cookie = require('cookie')

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
	
	if (Object.keys(cookies).length == 0) 
		throw Error('Missing cookies, you need to log in first')
	
	let cookieString = objectToCookieString(cookies)
	
	let url = event.queryStringParameters.url
	
	if (!url) throw Error('Did not supply URL')
	
	const config = {
		headers: {
			'Referer': 'https://access.adelaide.edu.au/sa/',
			'Cookie': cookieString
		}
	}
	
	res = await axios.get('https://access.adelaide.edu.au/sa/' + url, config)

	if(res.request._redirectable._isRedirect) {
		// Redirected, meaning we are not logged in or there are missing query parameters
		throw Error("Redirected, you are probably not logged in")
	}
	
	let result = {
      statusCode: 200,
      body: res.data,
    }
	
    return result
  } catch (err) {
	console.log(err)
    return { statusCode: 500, body: err.toString() }
  }
}
