import removeTimezone from '../utils/removetimezone.js';

class MovieDto {
    id;
    title;
    trailerVideo;
    duration;
    director;
    releaseDate;
    description;
    genres;
    ageRating;
    actors;
    imageUrls;

    constructor(movie, host) {
        this.id = movie.id;
        this.title = movie.title;
        this.trailerVideo = movie.trailerVideo;
        this.duration = movie.duration;
        this.director = movie.director;
        this.releaseDate = movie.releaseDate;
        this.description = movie.description;
        this.genres = movie.genres;
        this.ageRating = movie.ageRating;
        this.actors = movie.actors;
        this.imageUrls = movie.images ? movie.images.map(image => `${host}/${image}`) : [];
    }
}

class MovieWithSessionsDto {
    id;
    title;
    trailerVideo;
    duration;
    director;
    releaseDate;
    description;
    genres;
    ageRating;
    actors;
    imageUrls;
    sessions;

    constructor(movie, host) {
        this.id = movie.id;
        this.title = movie.title;
        this.trailerVideo = movie.trailerVideo;
        this.duration = movie.duration;
        this.director = movie.director;
        this.releaseDate = movie.releaseDate;
        this.description = movie.description;
        this.genres = movie.genres;
        this.ageRating = movie.ageRating;
        this.actors = movie.actors;
        this.imageUrls = movie.images ? movie.images.map(image => `${host}/${image}`) : [];
        this.sessions = (movie.Sessions || []).map(session => ({
            id: session.id,
            movieId: session.movieId,
            sessionTime: removeTimezone(session.sessionTime),
            hall: session.Hall
                ? {
                      id: session.Hall.id,
                      name: session.Hall.name,
                      rowCount: session.Hall.rowCount,
                      seatCount: session.Hall.seatCount,
                  }
                : null,
        }));
    }
}
export { MovieDto, MovieWithSessionsDto };
