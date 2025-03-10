export default class MovieDto {
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
