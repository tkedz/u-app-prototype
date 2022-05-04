export const DOMStrings = {
    searchForm: 'search-form',
    searchInput: 'search-input',
    searchResInner: 'search-results-inner',
    myMoviesSection: 'movies-container',
    myMoviesInner: 'my-movies-inner',
    detailsModal: 'details-modal',
    detailsTitle: 'details-title',
    detailsPoster: 'details-poster',
    detailsDirector: 'details-director',
    detailsGenre: 'details-genre',
    detailsPlot: 'details-plot',
    detailsActors: 'details-actors',
    detailsAwards: 'details-awards',
    detailsBoxOffice: 'details-boxoffice',
    detailsReleased: 'details-released',
    detailsRuntime: 'details-runtime',
    rottenRating: 'rotten-rating',
    metacriticRating: 'metacritic-rating',
    imdbRating: 'imdb-rating',
    addMovieForm: 'add-movie-form',
    review: 'review',
    watchday: 'watchday',
    myRating: 'my-rating',
    myRatingDisplay: 'my-rating-display',
    cinemaHall: 'cinema-hall',
    configModalSave: 'btn-config-save',
    unlimitedDate: 'unlimited-date',
    ticketsDiscount: 'ticket-discount',
    statsMovies: 'movies-watched',
    stats2D: '2d',
    stats3D: '3d',
    statsIMAX2D: 'imax',
    statsIMAX3D: 'imax-3d',
    stats4DX2D: '4dx2d',
    stats4DX3D: '4dx3d',
    statsAvgRtng: 'avg',
    statsSavedMoney: 'saved-money',
    statsMoneyOnUnlimited: 'unlimited-money',
    statsMoneyOnTickets: 'tickets-money',
    statsTime: 'time',
    statsGenres: 'genres',
    statsDirectors: 'directors',
    reverseBtn: 'reverse-btn',
    optionsBtn: 'options-btn',
    detailsBtn: 'details-btn',
    editBtn: 'edit-btn',
    deleteBtn: 'delete-btn',
    exportBtn: 'export-btn',
    importBtn: 'import-btn',
    chart: 'chart',
};

export const checkPoster = (currentPoster) => {
    let poster;
    if (currentPoster === 'N/A') {
        poster =
            'https://cdn1.iconfinder.com/data/icons/toolbar-signs/512/cancel-512.png';
    } else {
        poster = currentPoster;
    }

    return poster;
};

export const displaySpinner = (DOMElement) => {
    DOMElement.innerHTML = `
        <div class="spinner-border text-info d-inline-block mx-auto mt-2" style="width: 3rem; height: 3rem;">
            <span class="sr-only">Loading...</span>
        </div>`;
};

export const displayResultsBase = (isSearch) => {
    //if true return function to displayView else return function to myMoviesView
    if (isSearch) {
        return function (data) {
            //console.log(data);

            data.forEach((current) => {
                //check if there is poster available
                const poster = checkPoster(current.Poster);

                const html = `<div class="card m-2 border-0">
                <img src="${poster}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title h6">${current.Title} (${current.Year})</h5>
                </div>
                <div class="card-footer">
                    <button class="btn btn-info btn-block stretched-link details-btn"
                    data-id="${current.imdbID}">Szczegóły</button>
                </div>`;

                //update markup with new results
                document
                    .getElementById(DOMStrings.searchResInner)
                    .insertAdjacentHTML('beforeend', html);
            });
        };
    } else {
        return function (data) {
            data.forEach((current) => {
                const poster = checkPoster(current.poster);
                let date = new Date(current.watchday);
                let formattedDate =
                    date.getDate() +
                    '-' +
                    (date.getMonth() + 1) +
                    '-' +
                    date.getFullYear();
                const html = `
                <div class="card border-0 mt-3">
                    <div class="row no-gutters">
                        <div class="col-md-auto text-center">
                            <img src="${poster}" alt="" width="220px" height="330px">
                        </div>
                        <div class="col-md">
                            <div class="card-body px-2" style="position: relative;">
                                <h4 class="card-title">${current.title} (${current.year})</h4>
                                <p class="h6">${current.director}</p>
                                <hr class="bg-info">
                                <p class="card-text">${current.review}</p>
                                <p class="h5">⭐ ${current.rating}/10</p>
                                <p class="h5" style="position: absolute; bottom: 3; right: 3;">📅 ${formattedDate}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer w-100">
                        <button class="btn btn-info edit-btn" data-id="${current.id}">Edytuj</button>
                        <button class="btn btn-danger delete-btn" data-id="${current.id}">Usuń</button>
                    </div>
                </div>`;

                document
                    .getElementById(DOMStrings.myMoviesInner)
                    .insertAdjacentHTML('beforeend', html);
            });
        };
    }
};
