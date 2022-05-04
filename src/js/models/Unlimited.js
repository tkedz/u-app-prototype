// prettier-ignore
export default class Unlimited {
    constructor(since, tickets) {
        this.since = since;
        this.tickets = tickets;

        this.summary = {};
    }

    calculate(watched) {
        if (watched) {
            this.summary.moneyUnlimited = 0;
            let date = new Date(this.since);
            const endDate = new Date();
            while (date <= endDate) {
                if (date >= new Date(0) && date <= new Date()) {
                    this.summary.moneyUnlimited += 38;
                }
                date.setMonth(date.getMonth() + 1);
            }

            let prices = {};
            date = new Date(this.since);
            if (date >= new Date(0) && date <= new Date()) {
                prices = {
                    regular: {
                        _2D: 21.5,
                        _3D: 24.5,
                        _IMAX2D: 21.5,
                        _IMAX3D: 21.5,
                        _4DX2D: 12.5,
                        _4DX3D: 12.5,
                    },
                    discount: {
                        _2D: 17.5,
                        _3D: 26.5,
                        _IMAX2D: 17.5,
                        _IMAX3D: 17.5,
                        _4DX2D: 8.5,
                        _4DX3D: 8.5,
                    },
                };
            }

            this.summary.countAll = watched.length;
            this.summary.counts = [0, 0, 0, 0, 0, 0];
            this.summary.ticketsMoney = 0;
            this.summary.time = 0;
            let directorsObj = {};
            let genresObj = {};
            this.summary.directors = [];
            this.summary.genres = [];
            let sumRatings = 0;

            console.log(watched);
            watched.forEach((cur) => {
                switch (cur.cinemaHall) {
                    case '2D':
                        this.summary.counts[0] += 1;
                        break;
                    case '3D':
                        this.summary.counts[1] += 1;
                        break;
                    case 'IMAX2D':
                        this.summary.counts[2] += 1;
                        break;
                    case 'IMAX3D':
                        this.summary.counts[3] += 1;
                        break;
                    case '4DX2D':
                        this.summary.counts[4] += 1;
                        break;
                    case '4DX3D':
                        this.summary.counts[5] += 1;
                        break;
                }

                this.summary.ticketsMoney +=
                    prices[cur.ticketType][`_${cur.cinemaHall}`];

                sumRatings += parseInt(cur.rating);

                this.summary.time += parseInt(cur.runtime.split(' ')[0]);

                //directors && genres
                const directorsTmp = cur.director.split(', ');
                directorsTmp.forEach((d) => {
                    if (!directorsObj.hasOwnProperty(d))
                        directorsObj[d] = 1;
                    else directorsObj[d] += 1;
                });

                const genresTmp = cur.genre.split(', ');
                genresTmp.forEach((g) => {
                    if (!genresObj.hasOwnProperty(g))
                        genresObj[g] = 1;
                    else genresObj[g] += 1;
                });
            });

            try {
                let tmp;
                let i=0;
                let loopEnd = Object.keys(directorsObj).length > 3 ? 3 : Object.keys(directorsObj).length;
                for(i=0;i<loopEnd;i++) {
                    tmp = Object.keys(directorsObj).reduce((a, b) =>directorsObj[a] > directorsObj[b]? a: b);
                    this.summary.directors[i] = tmp;
                    delete directorsObj[tmp];
                }
    
                loopEnd = Object.keys(genresObj).length > 3 ? 3 : Object.keys(genresObj).length;
                for(i=0;i<loopEnd;i++) {
                    tmp = Object.keys(genresObj).reduce((a, b) =>genresObj[a] > genresObj[b]? a: b);
                    this.summary.genres[i] = tmp;
                    delete genresObj[tmp];
                }
            } catch(e) {
                console.log(e);
            }

            this.summary.savedMoney = this.summary.ticketsMoney - this.summary.moneyUnlimited;
            this.summary.avgRating = sumRatings / this.summary.countAll;
            this.summary.avgRating = this.summary.avgRating.toFixed(2);

            console.log(this.summary);
        }
    }

    save() {
        localStorage.setItem('summary', JSON.stringify(this.summary));
    }

    read() {
        const storage = JSON.parse(localStorage.getItem('summary'));

        if (storage) this.summary = storage;
    }
}
