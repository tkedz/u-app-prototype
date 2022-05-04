import { DOMStrings, checkPoster } from './base';

export const displayDetails = (movie) => {
    movie.poster = checkPoster(movie.poster);

    document.getElementById(DOMStrings.detailsTitle).innerHTML = movie.title;
    document.getElementById(DOMStrings.detailsPoster).src = movie.poster;
    document.getElementById(DOMStrings.detailsDirector).innerHTML =
        movie.director;
    //
    document.getElementById(DOMStrings.detailsGenre).innerHTML = movie.genre;
    document.getElementById(DOMStrings.detailsPlot).innerHTML = movie.plot;
    document.getElementById(DOMStrings.detailsActors).innerHTML = movie.actors;
    document.getElementById(DOMStrings.detailsAwards).innerHTML = movie.awards;
    document.getElementById(DOMStrings.detailsBoxOffice).innerHTML =
        movie.boxOffice;
    document.getElementById(DOMStrings.detailsReleased).innerHTML =
        movie.released;
    document.getElementById(DOMStrings.detailsRuntime).innerHTML =
        movie.runtime;
    document.getElementById(DOMStrings.rottenRating).innerHTML =
        movie.rottenTomatoes;
    document.getElementById(DOMStrings.metacriticRating).innerHTML =
        movie.metacritic;
    document.getElementById(DOMStrings.imdbRating).innerHTML = movie.imdb;

    if (movie.watchday) {
        const date = new Date(movie.watchday);
        document.getElementById(DOMStrings.watchday).value = date
            .toISOString()
            .substring(0, 10);
    } else {
        document.getElementById(DOMStrings.watchday).value = null;
    }

    if (movie.review) {
        document.getElementById(DOMStrings.review).value = movie.review;
        document.getElementById(DOMStrings.myRating).value = movie.rating;
        document.getElementById(DOMStrings.myRatingDisplay).innerHTML =
            movie.rating;
        document.getElementById(DOMStrings.cinemaHall).value = movie.cinemaHall;
    } else {
        document.getElementById(DOMStrings.review).value = '';
        document.getElementById(DOMStrings.myRating).value = 1;
        document.getElementById(DOMStrings.myRatingDisplay).innerHTML = 1;
        document.getElementById(DOMStrings.cinemaHall).value = '2D';
    }

    $(`#${DOMStrings.detailsModal}`).modal({
        show: true,
    });
};

export const getForm = () => {
    const addMovieForm = document.getElementById(DOMStrings.addMovieForm);
    const myForm = new FormData(addMovieForm);

    return [
        myForm.get('review'),
        myForm.get('watchday'),
        myForm.get('my-rating'),
        myForm.get('cinema-hall'),
    ];
};
