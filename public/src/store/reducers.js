import { combineReducers } from 'redux'
import { SELECT_BUNDLE,
	RECEIVE_BUNDLE_LIST, 
	RECEIVE_TOKEN_LIST,
	SET_LOADING_STATE, SET_SNACKBAR_STATE } from './actions'

function bundle(state=null, action) {
	switch (action.type) {
		case SELECT_BUNDLE:
			return action.bundle
		default:
			return state
	}
}

function bundleList(state=[], action) {
	switch (action.type) {
		case RECEIVE_BUNDLE_LIST:
			return action.bundles
		default:
			return state
	}
}

function tokenList(state=[], action) {
	switch (action.type) {
		case RECEIVE_TOKEN_LIST:
			return action.tokens
		default:
			return state
	}
}

function isLoading(state=false, action) {
	switch (action.type) {
		case SET_LOADING_STATE:
			return action.isLoading
		default:
			return state
	}
}

function snackbar(state={isVisible: false, message: ''}, action) {
	switch (action.type) {
		case SET_SNACKBAR_STATE:
			return {
				isVisible: action.isVisible,
				message: action.message
			}
		default:
			return state
	}
}

const rootReducer = combineReducers({
	bundle,
	bundleList,
	tokenList,
	isLoading,
	snackbar
})

export default rootReducer