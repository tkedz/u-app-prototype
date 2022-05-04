// Global app controller
import { DOMStrings, displaySpinner } from './views/base';
import Search from './models/Search';
import * as searchView from './views/searchView';
import Movie from './models/Movie';
import * as detailsView from './views/detailsView';
import Watched from './models/Watched';
import * as myMoviesView from './views/myMoviesView';
import Unlimited from './models/Unlimited';
import * as summaryView from './views/summaryView';
const alertify = require('alertifyjs');

// state object stores current data
const state = {};

// Search controller
const searchController = async () => {
    //get query from view
    const query = searchView.getQuery();

    if (query) {
        //clear UI and displaySpinner
        searchView.clearResults();
        displaySpinner(document.getElementById(DOMStrings.searchResInner));

        //save search obj to state obj
        state.search = new Search(query);

        //get results
        try {
            await state.search.getResults();
            //console.log(state.search);

            //update searchView
            searchView.clearResults(); //clearing spinner here not results
            searchView.displayResults(state.search.result);
        } catch (error) {
            //alert(error);
        }
    }
};

const searchForm = document.getElementById(DOMStrings.searchForm);
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchController();
});

const detailsController = async (id) => {
    //check if this movie is watched
    const index = state.watched.movies.findIndex((element) => element.id == id);

    //console.log(state.watched);
    //console.log(index);
    //console.log(state.watched.movies[index]);
    //console.log(state.movie);

    //create new Movie obj in state
    if (index === -1) {
        state.movie = new Movie(id);
        console.log('if', state.movie);
    } else {
        //here we have to set prototype of Movie class to a Movie obj readed from JSON data
        state.movie = state.watched.movies[index];
        console.log('else', state.movie);
        Object.setPrototypeOf(state.movie, Movie.prototype);
    }

    //get details about movie
    try {
        await state.movie.getDetails();
        //console.log(state.movie)

        //update details modal
        detailsView.displayDetails(state.movie);
    } catch (error) {
        alert(error);
    }
};

const searchResContainer = document.getElementById(DOMStrings.searchResInner);
const myMoviesContainer = document.getElementById(DOMStrings.myMoviesSection);

//Event delegation. It allows user to add, edit or remove movie
[searchResContainer, myMoviesContainer].forEach((cur) => {
    cur.addEventListener('click', (e) => {
        //if (e.target.nodeName === 'BUTTON' && e.target.id !== 'reverse-btn') {
        if (
            e.target.nodeName === 'BUTTON' &&
            (e.target.classList.contains(DOMStrings.detailsBtn) ||
                e.target.classList.contains(DOMStrings.editBtn))
        ) {
            console.log(e.target.dataset.id);
            detailsController(e.target.dataset.id);
        } else if (
            e.target.nodeName === 'BUTTON' &&
            e.target.classList.contains(DOMStrings.deleteBtn)
        ) {
            const id = e.target.dataset.id;
            console.log(e.target.dataset.id);
            const index = state.watched.movies.findIndex(
                (element) => element.id == id
            );
            state.watched.deleteMovie(index);
            state.watched.save();

            //refresh myMoviesView
            myMoviesView.clearResults();
            myMoviesView.displayResults(state.watched.movies);

            //update Unlimited obj with summary
            state.unlimited.calculate(state.watched.movies);
            state.unlimited.save();

            //refresh summaryView
            summaryView.displaySummary(state.unlimited.summary);
        }
    });
});

//Saving movie controller
const addMovieForm = document.getElementById(DOMStrings.addMovieForm);
addMovieForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const [review, watchday, rating, cinemaHall] = detailsView.getForm();

    console.log('STATE', state.tickets);
    state.movie.addReview(review, watchday, rating, cinemaHall, state.tickets);

    if (!state.watched) {
        state.watched = new Watched();
    }

    //check if movie is saved for a first time or if its edited
    const index = state.watched.movies.findIndex(
        (element) => element.id == state.movie.id
    );

    if (index !== -1) {
        state.watched.editMovie(index, state.movie);
    } else {
        state.watched.addMovie(state.movie);
    }

    state.watched.save();

    //refresh myMoviesView
    myMoviesView.clearResults();
    myMoviesView.displayResults(state.watched.movies);

    //update Unlimited obj with summary
    state.unlimited.calculate(state.watched.movies);
    state.unlimited.save();

    //refresh summaryView
    summaryView.displaySummary(state.unlimited.summary);

    //inform user that movie has been saved or edited
    alertify.success('Zapisano!');
});

//load watched movies which are saved in localStorage
window.addEventListener('load', () => {
    //set all datepickers' max date to today
    setDatepickersMaxDates();

    document.getElementById(DOMStrings.unlimitedDate);

    const since = localStorage.getItem('since');
    const tickets = localStorage.getItem('tickets');
    if (since && tickets) {
        //calculate how many months have passed since subscribing to unlimited
        //const months = calcMonths(since);

        state.unlimited = new Unlimited(since, tickets);
        state.unlimited.read();
        state.tickets = tickets;
        //console.log(state.unlimited);
    } else {
        //run config modal if its first use of an app
        $('#config-modal').modal('show');
    }

    state.watched = new Watched();
    state.watched.read();

    //fill myMoviesView with data from state.watched
    myMoviesView.displayResults(state.watched.movies);

    //init summaryView
    summaryView.displaySummary(state.unlimited.summary);
});

//Save configuration, config modal controller
const configModal = document.getElementById(DOMStrings.configModalSave);
configModal.addEventListener('click', () => {
    const since = document.getElementById(DOMStrings.unlimitedDate).value;
    const tickets = document.getElementById(DOMStrings.ticketsDiscount).value;
    if (since && tickets) {
        localStorage.setItem('since', since);
        localStorage.setItem('tickets', tickets);
        //console.log('saved??');

        state.unlimited = new Unlimited(since, tickets);
        state.tickets = tickets;
        state.watched = new Watched();
        state.watched.read();
        state.unlimited.calculate(state.watched.movies);
        state.unlimited.save();
        // myMoviesView.clearResults();
        // myMoviesView.displayResults(state.watched.movies);
        summaryView.displaySummary(state.unlimited.summary);

        document.getElementById(DOMStrings.unlimitedDate).value = null;
        document.getElementById(DOMStrings.ticketsDiscount).value = null;

        $('#config-modal').modal('hide');
    }
});

//open config modal to change options
document
    .getElementById(DOMStrings.optionsBtn)
    .addEventListener('click', (e) => {
        const date = new Date(localStorage.getItem('since'));
        document.getElementById(DOMStrings.unlimitedDate).value = date
            .toISOString()
            .substring(0, 10);
        document.getElementById(DOMStrings.ticketsDiscount).value =
            state.tickets;
        $('#config-modal').modal('show');
    });

//Change sorting event
document
    .getElementById(DOMStrings.reverseBtn)
    .addEventListener('click', (e) => {
        //change button text
        e.target.innerText =
            e.target.innerText === 'Najstarsze' ? 'Najnowsze' : 'Najstarsze';

        state.watched.reverse();

        myMoviesView.clearResults();
        myMoviesView.displayResults(state.watched.movies);
    });

//Show data to export
document.getElementById(DOMStrings.exportBtn).addEventListener('click', (e) => {
    const dataToExport = localStorage.getItem('watched');
    alert(
        `Skopiuj:\n\n\n${dataToExport}\n\n\nI użyj funkcji importowania danych uruchamiając aplikację w innej przeglądarce`
    );
});

//Import data
document.getElementById(DOMStrings.importBtn).addEventListener('click', (e) => {
    const dataToImport = prompt('Wklej dane');
    if (dataToImport !== null && isJson(dataToImport)) {
        console.log('ebebe');
        localStorage.setItem('watched', dataToImport);
        state.watched = new Watched();
        state.watched.read();
        state.unlimited.calculate(state.watched.movies);
        state.unlimited.save();
        myMoviesView.clearResults();
        myMoviesView.displayResults(state.watched.movies);
        summaryView.displaySummary(state.unlimited.summary);
    } else if (dataToImport !== null) {
        console.log('nie json?');
        alert('Nieprawidłowe dane');
    }
});

//helper functions
const calcMonths = (since) => {
    //calculate how many months have passed since subscribing to unlimited
    const year1 = parseInt(since.substr(0, 4));
    const month1 = parseInt(since.substr(5, 2));

    const currDate = new Date();
    const year2 = currDate.getFullYear();
    const month2 = currDate.getMonth();

    return (year2 - year1) * 12 + (month2 - month1);
};

const setDatepickersMaxDates = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    document
        .getElementById(DOMStrings.unlimitedDate)
        .setAttribute('max', today);
    document.getElementById(DOMStrings.watchday).setAttribute('max', today);
};

const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};
