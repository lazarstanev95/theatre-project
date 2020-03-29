import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';
import notificationServices from '../services/notification'

export const registerUser = (user, history) => dispatch => {
    axios.post('/user/signup', user)
        .then(res => {
            notificationServices.success(`Profile created`);
            history.push('/login')
        })
        .catch(err => {
            notificationServices.error(err.response.data.message)
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const loginUser = (user, history) => dispatch => {
    axios.post('/user/login', user)
        .then(res => {
            console.log(res.data);
            const { token } = res.data;
            localStorage.setItem('jwtToken', token);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
            notificationServices.success(`Successfully logged`);
            history.push('/')
        })
        .catch(err => {
            notificationServices.error(err.response.data.message)
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    if (history) {
        history.push('/login');
    }
}