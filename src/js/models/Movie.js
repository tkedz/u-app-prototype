import axios from 'axios';
import { key } from '../config';

export default class Movie {
    constructor(id) {
        this.id = id;
    }

    async getDetails() {
        try {
            const response = await axios(
                `http://www.omdbapi.com/?i=${this.id}&apikey=${key}`
            );

            //console.log(response);

            this.title = response.data.Title;
            this.director = response.data.Director;
            this.genre = response.data.Genre;
            this.plot = response.data.Plot;
            this.released = response.data.Released;
            this.year = response.data.Year;
            this.runtime = response.data.Runtime;
            this.actors = response.data.Actors;
            this.awards = response.data.Awards;
            this.boxOffice = response.data.BoxOffice;
            this.poster = response.data.Poster;
            if (response.data.Ratings[1]) {
                this.rottenTomatoes = response.data.Ratings[1].Value;
            } else {
                this.rottenTomatoes = 'N/A';
            }
            this.metacritic = response.data.Metascore;
            this.imdb = response.data.imdbRating;

            //console.log(this);
        } catch (error) {
            alert('Nie udało się wczytać dokładnych danych');
        }
    }

    //dodac date
    addReview(review, watchday, rating, cinemaHall, ticketType) {
        this.review = review;
        this.watchday = watchday;
        this.rating = rating;
        this.cinemaHall = cinemaHall;
        this.ticketType = ticketType;
        console.log(ticketType);
    }
}
