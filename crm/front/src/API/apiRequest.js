import { AUTH_LOGIN_URL, AUTH_LOGOUT_URL, MOVIE_GET_ALL_URL, 
    SESSION_CREATE_URL ,
    SESSION_GET_ALL_URL ,
    SESSION_UPDATE_URL ,
    SESSION_CHANGE_SEAT_CATEGORY_URL,
    SESSION_DELETE_URL,
    SESSION_GET_URL,
    TICKET_BOOKING_URL,
    MOVIE_GET_URL,
    MOVIE_DELETE_URL,
    MOVIE_UPDATE_URL,
    MOVIE_CREATE_URL,
    HALL_CREATE_URL,
    HALL_GET_ALL_URL,
    HALL_GET_URL,
    HALL_DELETE_URL, 
    HALL_CREATE_SESSION_URL,
    PROMOTION_CREATE_URL,
    PROMOTION_GET_URL,
    PROMOTION_UPDATE_URL,
    PROMOTION_GET_ALL_URL,
    PROMOTION_DELETE_URL,
    AUTH_GET_ALL_USERS_URL,
    GET_ALL_NEWS_URL,
    CREATE_NEWS_URL,
    UPDATE_NEWS_URL,
    GET_NEWS_URL,
    GET_ALL_TICKETS_URL
} from './ApiUrl';
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

export const addMovie = async (data) => {
    try {
      const response = await api.post(MOVIE_CREATE_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }
      });
      return response;
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  

export const updateMovie = async (id, data) => {
    try {
        const response = await api.patch(`${MOVIE_UPDATE_URL}/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteMovie = async id => {
    try {
        const response = await api.delete(`${MOVIE_DELETE_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

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

export const createSession = async data => {
    try {
        const response = await api.post(SESSION_CREATE_URL, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const updateSession = async (id, data) => {
    try {
        const response = await api.patch(`${SESSION_UPDATE_URL}/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteSession = async id => {
    try {
        const response = await api.delete(`${SESSION_DELETE_URL}/${id}`);
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

//!Залы

export const getAllHalls = async () => {
    try {
        const response = await api.get(HALL_GET_ALL_URL);
        return response;
    } catch (error) {
        return error;
    }
}

export const getOneHall = async id => {
    try {
        const response = await api.get(`${HALL_GET_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const createHall = async data => {    
    try {
        const response = await api.post(HALL_CREATE_URL, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const updateHall = async data => {
    try {
        const response = await api.patch(HALL_CREATE_URL, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteHall = async id => {
    try {
        const response = await api.delete(`${HALL_DELETE_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

//! Promotions
export const createPromotion = async data => {
    try {
        const response = await api.post(PROMOTION_CREATE_URL, data, {
            headers: {
              'Content-Type': 'multipart/form-data', 
            }
          });
        return response;
    } catch (error) {
        return error;
    }
}

export const getAllPromotions = async () => {
    try {
        const response = await api.get(PROMOTION_GET_ALL_URL);
        return response;
    } catch (error) {
        return error;
    }
}

export const getOnePromotion = async id => {
    try {
        const response = await api.get(`${PROMOTION_GET_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const updatePromotion = async (id, data) => {
    try {
        const response = await api.patch(`${PROMOTION_UPDATE_URL}/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const deletePromotion = async id => {
    try {
        const response = await api.delete(`${PROMOTION_DELETE_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await api.get(AUTH_GET_ALL_USERS_URL);
        return response;
    } catch (error) {
        return error;
    }
}

//!News

export const createNews = async data => {
    try {
        const response = await api.post(CREATE_NEWS_URL, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const getAllNews = async () => {
    try {
        const response = await api.get(GET_ALL_NEWS_URL);
        return response;
    } catch (error) {
        return error;
    }
}

export const getOneNews = async id => {
    try {
        const response = await api.get(`${GET_NEWS_URL}/${id}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const updateNews = async (id, data) => {
    try {
        const response = await api.patch(`${UPDATE_NEWS_URL}/${id}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const getAllTickets = async () => {
    try {
        const response = await api.get(GET_ALL_TICKETS_URL);
        return response;
    } catch (error) {
        return error;
    }
}