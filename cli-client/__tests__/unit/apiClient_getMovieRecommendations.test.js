const nock = require('nock');
const { getToken } = require('../../src/utils/tokenStorage');
const { getMovieRecommendations } = require('../../src/apiClient');

jest.mock('../../src/utils/tokenStorage', () => ({
    getToken: jest.fn(),
}));

describe('getMovieRecommendations', () => {
    const baseURL = 'https://localhost:9876/ntuaflix_api';
    const token = 'validToken123';
    const genres = ['Comedy', 'Short'];
    const actors = ['nm0066941', 'nm0170183'];
    const director = 'nm0000001';

    beforeEach(() => {
        nock.cleanAll();
        getToken.mockReturnValue(token); // Assume a valid token is always returned
    });

    it('successfully retrieves movie recommendations in JSON', async () => {
        const mockResponse = {
            movies: [
                { 
                    title_id: "tt0000929",
                    original_title: "Klebolin klebt alles",
                    image_url_poster: null,
                    average_rating: "5.30",
                    num_votes: "46"
                },
                { 
                    title_id: "tt0000930",
                    original_title: "Klebolin klebt alles 2",
                    image_url_poster: null,
                    average_rating: "5.40",
                    num_votes: "47"
                }
            ]
        };


        nock(baseURL)
            .get('/recommendations', { genres, actors, director })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, mockResponse);
        const response = await getMovieRecommendations(genres, actors, director, 'json');
        expect(response).toEqual(mockResponse);
    });

    it('successfully retrieves movie recommendations in CSV', async () => {
        const csvResponse = "title_id,original_title,image_url_poster,average_rating,num_votes\n" +
            "tt0000929,Klebolin klebt alles,,5.30,46\n" +
            "tt0000930,Klebolin klebt alles 2,,5.40,47";
        nock(baseURL)
            .get('/recommendations', { genres, actors, director })
            .query({ format: 'csv' })
            .matchHeader('x-observatory-auth', token)
            .reply(200, csvResponse);
        const response = await getMovieRecommendations(genres, actors, director, 'csv');
        expect(response).toEqual(csvResponse);
    });

    it('throws an error for bad request', async () => {
        nock(baseURL)
            .get('/recommendations', { genres, actors, director })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(400, { message: 'Bad request' });
        await expect(getMovieRecommendations(genres, actors, director, 'json')).rejects.toThrow('Bad request');
    });

    it('throws an error for non-existent recommendations', async () => {
        nock(baseURL)
            .get('/recommendations', { genres, actors, director })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(404, { message: 'No recommendations found' });
        await expect(getMovieRecommendations(genres, actors, director, 'json')).rejects.toThrow('No recommendations found');
    });

    it('throws an error for unauthorized access', async () => {
        nock(baseURL)
            .get('/recommendations', { genres, actors, director })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(401, { message: 'Unauthorized access' });
        await expect(getMovieRecommendations(genres, actors, director, 'json')).rejects.toThrow('Unauthorized access');
    });

    it('throws an error for server error', async () => {
        nock(baseURL)
            .get('/recommendations', { genres, actors, director })
            .query({ format: 'json' })
            .matchHeader('x-observatory-auth', token)
            .reply(500, { message: 'Internal server error' });
        await expect(getMovieRecommendations(genres, actors, director, 'json')).rejects.toThrow('Internal server error');
    });

    it('throws an error for no token found', async () => {
        getToken.mockReturnValue(null);
        await expect(getMovieRecommendations(genres, actors, director, 'json')).rejects.toThrow('No token found');
    });

});