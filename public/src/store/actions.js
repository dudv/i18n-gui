import { makeRequest } from './utils'

export const SELECT_BUNDLE = 'SELECT_BUNDLE'

export const RECEIVE_BUNDLE_LIST = 'RECEIVE_BUNDLE_LIST'

export const RECEIVE_TOKEN_LIST = 'RECEIVE_TOKEN_LIST'

export const SET_LOADING_STATE = 'SET_LOADING_STATE'
export const SET_SNACKBAR_STATE = 'SET_SNACKBAR_STATE'

function request() {
	return dispatch => {
		dispatch(setLoadingState(true))
		return makeRequest(...arguments)
			.then(data => {
				dispatch(setLoadingState(false))
				return data
			})
	}
}

export function selectBundle(bundle) {
	return {
		type: SELECT_BUNDLE,
		bundle
	}
}

export function getBundleList() {
	return dispatch =>
		dispatch(request('/list_bundles'))
			.then(bundles => dispatch(receiveBundleList(bundles)))
}

function receiveBundleList(bundles) {
	return {
		type: RECEIVE_BUNDLE_LIST,
		bundles
	}
}

export function getTokenList(bundle, key) {
	return dispatch =>
		dispatch(request('/list_tokens', bundle, {key}))
			.then(tokens => dispatch(receiveTokenList(tokens)))
}

function receiveTokenList(tokens) {
	return {
		type: RECEIVE_TOKEN_LIST,
		tokens
	}
}


export function addToken(token) {
	return dispatch => 
		dispatch(request('/add_token', token.bundle, token, 'post'))
			.then(data => {
				const message = data.error ?
					`Error inserting key ${token.key}: duplicate detected` :
					`inserted new key ${token.key} for bundle ${token.bundle} with value ${token.value}`
				dispatch(setSnackbarState(true, message))
				dispatch(getTokenList(token.bundle, token.key))
			})
}

export function updateToken(token) {
	return dispatch =>
		dispatch(request('/update_token', token.bundle, {id: token.id, value: token.value}, 'post'))
			.then(_ => {
				const message = `updated key ${token.key} for bundle ${token.bundle} with value ${token.value}`
				dispatch(setSnackbarState(true, message))
				dispatch(getTokenList(token.bundle, token.key))
			})
}

export function setLoadingState(isLoading) {
	return {
		type: SET_LOADING_STATE,
		isLoading
	}
}

export function setSnackbarState(isVisible, message) {
	return {
		type: SET_SNACKBAR_STATE,
		isVisible,
		message
	}
}