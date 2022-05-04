import { DOMStrings, displayResultsBase } from './base';

export const getQuery = () => {
    return document.getElementById(DOMStrings.searchInput).value;
};

export const displayResults = displayResultsBase(true);

export const clearResults = () => {
    document.getElementById(DOMStrings.searchResInner).innerHTML = '';
};
