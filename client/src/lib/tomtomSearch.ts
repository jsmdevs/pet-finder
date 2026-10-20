import axios from "axios";
const API_KEY = import.meta.env.VITE_TOMTOM_KEY;

export async function searchLocationByQuery(query: string) {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.tomtom.com/search/2/search/` +
        encodedQuery +
        `.json?` +
        `key=${API_KEY}` +
        `&countrySet=AR` +
        `&limit=3` +
        `&typeahead=true`;

    const data = await axios(url);
    return data;
};

export async function reverseGeocode(lat: number, lng: number) {
    const url = `https://api.tomtom.com/search/2/reverseGeocode/` +
        `${lat},${lng}` +
        `.json?` +
        `key=${API_KEY}` +
        `&countrySet=AR` +
        `&limit=1` +
        `&typeahead=true`

    const data = await axios(url);
    return data;
};
