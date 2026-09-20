import { algoliasearch } from 'algoliasearch';

const APPLICATION_ID = process.env.ALGOLIA__APPLICATION_ID;
const API_KEY = process.env.ALGOLIA__API_KEY;

if (!APPLICATION_ID || !API_KEY) {
	throw new Error('ALGOLIA__APPLICATION_ID and ALGOLIA__API_KEY are required');
}

export const client = algoliasearch(APPLICATION_ID, API_KEY);