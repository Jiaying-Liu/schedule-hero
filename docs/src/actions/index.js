import axios from 'axios';
import { 
    FETCH_USER,
    LOGIN
} from './types';

if(process.env.REACT_APP_API_URL) {
    axios = axios.create({
        baseURL: process.env.REACT_APP_API_URL
    });  
}

// session actions
export const login = (username, password) => async dispatch => {
    const res = await axios.post('/auth', {username, password});

    dispatch({ type: LOGIN, payload: res.data });
} 

export const register = (name, username, password) => async dispatch => {
    const res = await axios.post('/api/register', {name, username, password});

    dispatch({ type: LOGIN, payload: res.data });
}

// user actions
export const fetchUser = () => async (dispatch, getState) => {
    axios.defaults.headers.common['Authorization'] = 'JWT ' + sessionStorage.access_token;
    const res = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
}