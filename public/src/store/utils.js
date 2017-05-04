import request from 'superagent'

const HOST = 'http://localhost:3001'
const buildUrl = (u, b) => HOST + u + (b ? '/' + b : '')

const makeRequest = (url, bundle=null, data={}, method='get') => {
	return request[method](buildUrl(url, bundle), data)
		.then(data => {
			return data.body
	 	})
}

export { makeRequest }