import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import Auth from './Auth';
import persistStore from './persistStore';

const RootReducer = combineReducers({
		Auth,
		persistStore,
		form: formReducer,
	});
export default RootReducer;
