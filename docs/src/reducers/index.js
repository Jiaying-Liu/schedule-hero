import { combineReducers } from 'redux';
import authReducer from './authReducer';
import sessionReducer from './sessionReducer';
import taskReducer from './taskReducer';

export default combineReducers({
    auth: authReducer,
    session: sessionReducer,
    tasks: taskReducer
    // appointments: appointmentReducer
})