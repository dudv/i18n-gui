const app = require('koa')()
const router = require('koa-router')()
const send = require('koa-send')
const serve = require('koa-static')
const cors = require('koa-cors')
const bodyParser = require('koa-body')()
const config = require('./config')
const knex = require('knex')({
	client: 'pg',
	connection: config
});

router.get('/list_bundles', function *(next) {
	const res = yield knex
		.distinct('bundle')
		.select('bundle')
		.from('i18n')
	this.body = res.map(x => x.bundle).filter(Boolean).sort()
})

router.get('/list_tokens/:bundle', function *(next) {
	const bundle = this.params.bundle
	const where = Object.assign(this.query, {bundle})
	this.assert(bundle, 'No bundle specified')
	this.body = yield knex
		.select()
		.from('i18n')
		.where(where)
		.limit(50)
})

router.post('/add_token/:bundle', bodyParser, function *(next) {
	const bundle = this.params.bundle
	const data = Object.assign(this.request.body, {bundle})
	this.assert(data.bundle && data.language && data.key && data.value, 'Invalid data to insert', data)
	try {
		this.body = yield knex
			.insert(data)
			.into('i18n')
	}
	catch (e) {
		this.body = {error: 400, details: e}
	}
})

router.post('/update_token/:bundle', bodyParser, function *(next) {
	const bundle = this.params.bundle
	const data = Object.assign(this.request.body, {bundle})
	this.assert(data.id && data.value, 'Invalid data to update', data)
	this.body = yield knex
		.where({id: data.id, bundle})
		.update({value: data.value})
		.into('i18n')
})

app.on('error', err => console.error('server error', err))

app
	.use(cors())
	.use(router.routes())
	.use(router.allowedMethods())
	.use(serve(__dirname + '/public/public'))
	.use(function* () {
	  yield send(this, __dirname + '/index.html')
	})
	.listen(3001)