import { DOMStrings, displayResultsBase } from './base';

export const displayResults = displayResultsBase(false);

export const clearResults = () => {
    document.getElementById(DOMStrings.myMoviesInner).innerHTML = '';
};