import moment from 'moment-timezone';

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
    typeFilm;
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
        this.typeFilm = movie.typeFilm;
        this.imageUrls = movie.images ? movie.images.map(image => `https://ipfs.io/ipfs/${image}`) : [];
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
    typeFilm;
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
        this.typeFilm = movie.typeFilm;
        this.imageUrls = movie.images ? movie.images.map(image => `https://ipfs.io/ipfs/${image}`) : [];
        this.sessions = (movie.Sessions || []).map(session => ({
            id: session.id,
            movieId: session.movieId,
            sessionTime: moment(session.sessionTime).tz('UTC').format('YYYY-MM-DDTHH:mm'),
            hall: session.Hall
                ? {
                      id: session.Hall.id,
                      name: session.Hall.name,
                      rowCount: session.Hall.rowCount,
                      seatCount: session.Hall.seatCount,
                  }
                : null,
            seatPrice:
                session.Seats && session.Seats.length > 0
                    ? {
                          price: session.Seats[0].SeatPriceCategory ? session.Seats[0].SeatPriceCategory.price : null,
                          category: session.Seats[0].SeatPriceCategory
                              ? session.Seats[0].SeatPriceCategory.categoryName
                              : null,
                      }
                    : null,
        }));
    }
}

export { MovieDto, MovieWithSessionsDto };
