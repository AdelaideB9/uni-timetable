const cookie = require('cookie')

exports.filterObjectKeys = function (obj, arr) {
	return Object.keys(obj)
		.filter(key => {
			for (const i in arr) {
				if (key.indexOf(arr[i]) > -1)
					return true
			}
			return false
		}).reduce((object, key) => {
			return {
				...object,
				[key]: obj[key]
			}
		}, {})
}

exports.objectHasKeys = function (obj, arr) {
	for (const i in arr) {
		if (!exports.objectHasKey(obj, arr[i]))
			return false
	}
	return true
}

exports.objectHasKey = function (obj, str) {
	for (const val in obj) {
		if (val.indexOf(str) > -1)
			return true
	}
	return false
}

exports.objectToCookieString = function (cookies) {
	let cookieString = ""
	let i = 1
	for (const val in cookies) {
		cookieString += cookie.serialize(val, cookies[val])
		if (Object.keys(cookies).length != i)
			cookieString += '; '

		i++
	}
	return cookieString
}