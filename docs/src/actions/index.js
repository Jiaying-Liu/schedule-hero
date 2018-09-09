import axios from 'axios';
import { 
    FETCH_USER,
    LOGIN
} from './types';

var baseURL = '';

if(process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    console.log('here');
    baseURL = 'https://schedule-hero.herokuapp.com'
}

// session actions
export const login = (username, password) => async dispatch => {
    const res = await axios.post(baseURL + '/auth', {username, password});

    dispatch({ type: LOGIN, payload: res.data });
} 

export const register = (name, username, password) => async dispatch => {
    const res = await axios.post(baseURL + '/api/register', {name, username, password});

    dispatch({ type: LOGIN, payload: res.data });
}

// user actions
export const fetchUser = () => async (dispatch, getState) => {
    axios.defaults.headers.common['Authorization'] = 'JWT ' + sessionStorage.access_token;
    const res = await axios.get(baseURL + '/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
}