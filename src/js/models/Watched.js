export default class Watched {
    constructor() {
        this.movies = [];
    }

    addMovie(movie) {
        this.movies.push(movie);
    }

    deleteMovie(id) {
        this.movies.splice(id, 1);
    }

    editMovie(id, newData) {
        this.movies.splice(id, 1, newData);
    }

    save() {
        localStorage.setItem('watched', JSON.stringify(this.movies));
    }

    read() {
        const storage = JSON.parse(localStorage.getItem('watched'));

        if (storage) this.movies = storage;
    }

    reverse() {
        this.movies.reverse();
    }
}
