import axios from "axios";
import { key } from "../config";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            if (!this.query.startsWith("tt")) {
                //get movies by title
                const response = await axios(
                    `http://www.omdbapi.com/?apikey=${key}&s=${this.query}&type=movie`
                );

                this.result = response.data.Search;
            } else {
                //get movie by imdbId
                const response = await axios(
                    `http://www.omdbapi.com/?apikey=${key}&i=${this.query}&type=movie`
                );

                if (response.data.Response === "True") {
                    this.result = [response.data];
                } else {
                    throw false;
                }
            }

            console.log(this.result);
        } catch (error) {
            alert("Brak wyników");
        }
    }
}
