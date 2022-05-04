import { DOMStrings } from './base';

let myChart = null;

export const displaySummary = (summary) => {
    try {
        document.getElementById(DOMStrings.statsMovies).innerText =
            summary.countAll;
        document.getElementById(DOMStrings.statsAvgRtng).innerText =
            summary.avgRating;
        document.getElementById(DOMStrings.statsMoneyOnUnlimited).innerText =
            summary.moneyUnlimited;
        document.getElementById(DOMStrings.statsMoneyOnTickets).innerText =
            summary.ticketsMoney;
        document.getElementById(DOMStrings.statsSavedMoney).innerText =
            summary.savedMoney;
        document.getElementById(DOMStrings.statsTime).innerText =
            summary.time + ' min';
        const genresText = summary.genres.join(', ');
        document.getElementById(DOMStrings.statsGenres).innerText = genresText;
        const directorsText = summary.directors.join(', ');
        document.getElementById(DOMStrings.statsDirectors).innerText =
            directorsText;

        if (myChart) myChart.destroy();
        const ctx = document.getElementById(DOMStrings.chart).getContext('2d');
        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX 2D', '4DX 3D'],
                datasets: [
                    {
                        label: 'Liczba obejrzanych filmów w danej sali',
                        data: summary.counts,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 255)',
                            'rgb(255, 159, 64)',
                        ],
                        hoverOffset: 4,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    } catch (e) {
        console.log(e);
    }
};
