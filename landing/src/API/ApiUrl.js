export const AUTH_REGISTRATION_URL = '/auth/register';
export const AUTH_LOGIN_URL = '/auth/login';
export const AUTH_LOGOUT_URL = '/auth/logout';
export const AUTH_REFRESH_URL = '/auth/refresh';
export const AUTH_UPDATE_PROFILE_URL = '/auth/updateProfile';
export const AUTH_ADD_PAYMENT_METHOD_URL = '/auth/addPaymentMethod';

export const HALL_CREATE_URL = '/hall/createHall';
export const HALL_GET_ALL_URL = '/hall/getAllHalls';
export const HALL_GET_URL = '/hall/getHall/:id';
export const HALL_DELETE_URL = '/hall/deleteHall/:id';
export const HALL_CREATE_SESSION_URL = '/hall/createSession';

export const MOVIE_CREATE_URL = '/movie/createMovie';
export const MOVIE_GET_URL = '/movie/getMovie';
export const MOVIE_UPDATE_URL = '/movie/updateMovie/:id';
export const MOVIE_GET_ALL_URL = '/movie/getAllMovies';
export const MOVIE_DELETE_URL = '/movie/deleteMovie/:id';
export const MOVIE_GET_COMING_SOON_URL = '/movie/comingSoon';
export const MOVIE_GET_HITS_URL = '/movie/getHits';

export const PROMOTION_CREATE_URL = '/promotion/createPromotion';
export const PROMOTION_GET_URL = '/promotion/getPromotion/:id';
export const PROMOTION_UPDATE_URL = '/promotion/updatePromotion/:id';
export const PROMOTION_GET_ALL_URL = 'promotion/getAllPromotions';
export const PROMOTION_DELETE_URL = '/promotion/deletePromotion/:name';

export const SESSION_CREATE_URL = '/session/createSession';
export const SESSION_GET_ALL_URL = '/session/getAllSession';
export const SESSION_GET_URL = '/session/getSession';
export const SESSION_UPDATE_URL = '/session/updateSession/:id';
export const SESSION_CHANGE_SEAT_CATEGORY_URL = '/session/changeSeatCategory/:id';
export const SESSION_DELETE_URL = '/session/deleteSession/:id';

export const TICKET_BOOKING_URL = '/tickets/bookingTickets';

export const GET_ALL_NEWS_URL = '/news/getAllNewsForSite';
export const GET_NEWS_URL = '/news/getNews';

export const GET_ALL_POSTERS_URL = 'slider/getSliderForSite';
//Профиль
export const GET_USER_BONUS_URL = 'userBonus/getUserBonus';
export const GET_DATA_PROFILE = 'profile/getProfile';
export const GET_BONUS_HISTORY_URL = 'userBonus/getBonusHistory';
export const UPLOAD_PROFILE_IMAGE_URL = 'profile/uploadAvatar';
export const GET_USER_TICKETS_URL = 'tickets/getAllTicketsUser';
export const CANCEL_USER_TICKET_URL = 'tickets/cancelTicket';
export const GET_PAYMENT_METHODS_URL = 'profile/getPaymentMethods'
export const GET_ALL_PAYMENT_METHODS_URL = 'profile/getAllUserPaymentMethods'

export const CREATE_PAYMENT_METHODS_URL = 'profile/addPaymentMethod'

export const DELETE_PAYMENT_METHOD_URL = 'profile/deletePaymentMethod'