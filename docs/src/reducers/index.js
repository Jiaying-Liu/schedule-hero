import { combineReducers } from 'redux';
import authReducer from './authReducer';
import sessionReducer from './sessionReducer';

export default combineReducers({
    auth: authReducer,
    session: sessionReducer
})