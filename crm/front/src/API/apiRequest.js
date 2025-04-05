import { AUTH_LOGIN_URL, AUTH_LOGOUT_URL, AUTH_REGISTRATION_URL, MOVIE_GET_ALL_URL, SESSION_GET_ALL_URL, MOVIE_GET_URL, SESSION_GET_URL, TICKET_BOOKING_URL } from './ApiUrl';
import api from './axios';

//! Запрос на Выход
export const logout = async () => {
    const data = { refreshToken: localStorage.getItem('refreshToken') };
    try {
        const response = await api.post(AUTH_LOGOUT_URL, data);
        return response;
    } catch (error) {
        alert('Ошибка при выходе из системы !');
    }
};

//! Запрос на авторизацию
export const apiLogin = async UserData => {
    try {
        const response = await api.post(AUTH_LOGIN_URL, UserData);
        const { accessToken, refreshToken, role,  } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('role', role);
        return response;
    } catch (error) {
        return error;
    }
};


//!Фильмы 

export const getAllMovies = async () => {
    try {
        const response = await api.get(MOVIE_GET_ALL_URL);
        return response;
    } catch (error) {
        return error;
    }
};

export const getOneMovie = async id => {
    try {
        const response = await api.get(`${MOVIE_GET_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
};

//!Сеансы 

export const getAllSessions = async () => {
    try {
        const response = await api.get(SESSION_GET_ALL_URL);
        return response;
    } catch (error) {
        return error;
    }
}

export const getOneSession = async id => {
    try {
        const response = await api.get(`${SESSION_GET_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

//!билеты 
export const bookingTickets = async data => {
    try {
        const response = await api.post(TICKET_BOOKING_URL, data);
        return response;
    } catch (error) {
        return error;
    }
}